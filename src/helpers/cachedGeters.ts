import { BrandModel, CategoryModel, DiscountModel, UserModel } from "@/lib/DAL/Models"

const cacheMaxLifeTime =1000*60*15 

export function simpleCache<T extends () => Promise<any>>(func: T) {
	let cache: ReturnType<T>
	let fetching = false
	let validUntil: number
	function revalidate() {
		if (!cache){
			cache = func() as ReturnType<T>
			validUntil = Date.now()+cacheMaxLifeTime
			return true
		}
		if (fetching) return true
		fetching = true
		const newCache = func()
		newCache.then(_=>{
			cache = newCache as ReturnType<T>
			fetching = false
			validUntil = Date.now()+cacheMaxLifeTime
		})
		return true
	}
	function get() {
		if (!cache || Date.now()>validUntil){
				revalidate()
		}
		return cache
	}
	return [get, revalidate]
}

export const [getAllBrands, revalidateBrands] = simpleCache(() => BrandModel.find())
export const [getAllCategories, revalidateCategories] = simpleCache(() =>
	CategoryModel.find())
export const [getAllDiscounts,revalidateDiscounts] = simpleCache(()=> DiscountModel.find(),)

type Args = string

export function cachePar<T extends (arg:Args) => Promise<any>>(func: T, maxLifeTime=1000*60*1, maxSize=30) {
	const cache: Map<Args,{value:ReturnType<T>,fetching:boolean,validUntil:number}> = new Map()
	
	function addToCache(arg:Args){
		const value = func(arg) as ReturnType<T>
		if (cache.size<maxSize){
			cache.set(arg,{value,fetching:false,validUntil:Date.now()+maxLifeTime})
			return true
		}	
		let stalest:{stalestKey:Args,validUntil:number} = {stalestKey:'',validUntil:Infinity}
		for (const key of cache.keys()){
			const value = cache.get(key)!
			if (value.validUntil < stalest.validUntil){
				stalest.stalestKey=key
				stalest.validUntil = value.validUntil
			}
		}
		cache.delete(stalest.stalestKey)
		cache.set(arg,{value,fetching:false,validUntil:Date.now()+maxLifeTime})
	}

	function revalidate(arg:Args) {
		const cached = cache.get(arg)
		if (!cached) addToCache(arg)
		if (cached!.fetching) return true
		cached!.fetching = true
		const value = func(arg) as ReturnType<T>
		value.then(_=>cache.set(arg,{value,fetching:false,validUntil:Date.now()+maxLifeTime}))
		return true
	}
	async function patch(arg:Args,patch:Partial<Awaited<ReturnType<T>>>){
		const cached = cache.get(arg)
		if (!cached) return false
		const value = {...(await cached.value),...patch}
		cache.set(arg,{value,fetching:false,validUntil:Date.now()+maxLifeTime})
		return true
	}
	function present(arg:Args){
		const cached = cache.get(arg)
		if (!cached) return false
		if (cached.validUntil < Date.now()){
			cache.delete(arg)
			return false
		}
		return true
	}

	function get(arg:Args) {
		const cached = cache.get(arg)
		if (!cached) addToCache(arg)
		else if (Date.now()>cached.validUntil) revalidate(arg)
		return cache.get(arg)!.value as T
	}
	return {get,revalidate,patch,present}
}

export const UserCache = cachePar((name:string)=>UserModel.findOne({name}),1000*30,10)


