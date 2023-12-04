import {
	BrandModel,
	CategoryModel,
	DiscountModel,
	User,
	UserModel,
} from "@/lib/DAL/Models"
import { Serializable } from "child_process"

const maxLifeTime = 1000 * 60 * 15

export function simpleCache<T extends () => Promise<any>>(
	func: T,
	maxLifeTime = 1000 * 60 * 15
) {
	let cache: ReturnType<T>
	let cacheMap: Map<number, ReturnType<T>> = new Map()
	let fetching = false
	let validUntil: number

	function add() {}

	function revalidate() {
		if (!cache) {
			cache = func() as ReturnType<T>
			validUntil = Date.now() + maxLifeTime
			return true
		}
		if (fetching) return true
		fetching = true
		const newCache = func()
		newCache.then((_) => {
			cache = newCache as ReturnType<T>
			fetching = false
			validUntil = Date.now() + maxLifeTime
		})
		return true
	}
	function get() {
		if (!cache || Date.now() > validUntil) {
			revalidate()
		}
		return cache
	}
	return { get, revalidate }
}

export const BrandCache = simpleCache(() => BrandModel.find())
export const CategoryCache = simpleCache(() =>
	CategoryModel.find()
)
export const DiscountCache = simpleCache(() =>
	DiscountModel.find()
)

type Args = string

type safeSingleArgs = string & number & RegExp
type safeMultiArgs = Array<safeSingleArgs>
type safeRecordArgs = Record<
	string | number,
	safeSingleArgs & safeMultiArgs
>
type safeMRecordArgs = Record<string | number, safeRecordArgs>
type SafeArg = safeSingleArgs &
	safeMultiArgs &
	safeRecordArgs &
	safeMRecordArgs
type SafeFunction<T> = (...args: SafeArg[]) => T | T[]

/* export function cacheModel<
	model extends DataModel
>
(functions:Record<string,Func>, maxLifeTime = 1000 * 60 * 1, maxSize = 30, stale = true) {
	type CacheRecord = { value: Promise<Res|null>, fetching: boolean, validUntil: number }
	const cache: Map<string, CacheRecord> = new Map()

	async function add(func: Func, ...args: Args) {
		let valuesPre = await func(args)
		let values = (!Array.isArray(valuesPre)) ?  [valuesPre] : valuesPre
		if (values.length===0) values = [null] 
		for (const value of values) {
			if (cache.size < maxSize) {
				cache.set(JSON.stringify(args), { value: Promise.resolve(value), fetching: false, validUntil: Date.now() + maxLifeTime })
			}
			let stalest: { stalestKey: Args, validUntil: number } = { stalestKey: '', validUntil: Infinity }
			for (const key of cache.keys()) {
				const value = cache.get(key)!
				if (value.validUntil < stalest.validUntil) {
					stalest.stalestKey = key
					stalest.validUntil = value.validUntil
				}
			}
			cache.delete(stalest.stalestKey)
			cache.set(JSON.stringify(args), { value:Promise.resolve(value), fetching: false, validUntil: Date.now() + maxLifeTime })
		}
		return true
	}
	function getAll(){
		const objects = Object.values(cache) as CacheRecord[]
		return objects.map(record=>record.value)
	}
	const res:any = {}
	for (const [key,func] of Object.entries(functions)){
		res[key] = {
			add:(...args:any)=>add(func,args),
			getAll:getAll
		}
	}
	return res as {[i in keyof Rec]:{add:typeof add, getAll:typeof getAll}}

}

const list ={find:UserModel.find} 

const exp = cacheModel<User,Parameters<typeof UserModel.find>,typeof UserModel.find,typeof list>(list)

exp.find. */

export function cachePar<T extends (arg: Args) => Promise<any>>(
	func: T,
	maxLifeTime = 1000 * 60 * 1,
	maxSize = 30
) {
	const cache: Map<
		Args,
		{
			value: ReturnType<T>
			fetching: boolean
			validUntil: number
		}
	> = new Map()
	function add(arg: Args) {
		const value = func(arg) as ReturnType<T>
		if (cache.size < maxSize) {
			cache.set(arg, {
				value,
				fetching: false,
				validUntil: Date.now() + maxLifeTime,
			})
			return true
		}
		const stalest: { stalestKey: Args; validUntil: number } = {
			stalestKey: "",
			validUntil: Infinity,
		}
		for (const key of cache.keys()) {
			const value = cache.get(key)
			if (!value) {
				stalest.stalestKey = key
				break
			}
			if (value.validUntil < stalest.validUntil) {
				stalest.stalestKey = key
				stalest.validUntil = value.validUntil
			}
		}
		cache.delete(stalest.stalestKey)
		cache.set(arg, {
			value,
			fetching: false,
			validUntil: Date.now() + maxLifeTime,
		})
	}

	function revalidate(arg: Args) {
		const cached = cache.get(arg)
		if (!cached) add(arg)
		if (!cached) return false
		if (cached.fetching) return true
		cached.fetching = true
		const value = func(arg) as ReturnType<T>
		value.then((_) =>
			cache.set(arg, {
				value,
				fetching: false,
				validUntil: Date.now() + maxLifeTime,
			})
		)
		return true
	}
	async function patch(
		arg: Args,
		patch: Partial<Awaited<ReturnType<T>>>
	) {
		const cached = cache.get(arg)
		if (!cached) return false
		const value = { ...(await cached.value), ...patch }
		cache.set(arg, {
			value,
			fetching: false,
			validUntil: Date.now() + maxLifeTime,
		})
		return true
	}
	function present(arg: Args) {
		const cached = cache.get(arg)
		if (!cached) return false
		if (cached.validUntil < Date.now()) {
			cache.delete(arg)
			return false
		}
		return true
	}

	function get(arg: Args) {
		const cached = cache.get(arg)
		if (!cached) add(arg)
		else if (Date.now() > cached.validUntil) revalidate(arg)
		const value = cache.get(arg)?.value
		if (!value) return Promise.resolve(value)
		return value as ReturnType<T>
	}
	return { get, revalidate, patch, present }
}

export const UserCache = cachePar(
	(name: string) => UserModel.findOne({ name }),
	1000 * 30,
	10
)
