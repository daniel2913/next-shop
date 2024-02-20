import {
	BrandModel,
	CategoryModel,
	DiscountModel,
	UserModel,
} from "@/lib/Models"


export function simpleCache<T extends () => Promise<any>>(
	func: T,
	maxLifeTime = 1000 * 60 * 15
) {
	let cache: ReturnType<T>
	let fetching = false
	let validUntil: number

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

type Args = string

export function cacheParam<T extends (arg: Args) => Promise<any>>(
	func: T,
	maxLifeTime = 1000 * 60 * 1,
	maxSize = 30,
	stale = false
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

	async function revalidate(arg: Args) {
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
	async function patch(arg: Args, patch: Partial<Awaited<ReturnType<T>>>) {
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

	async function get(arg: Args) {
		const cached = cache.get(arg)
		if (!cached) add(arg)
		else if (Date.now() > cached.validUntil) {
			if (stale) revalidate(arg)
			else await revalidate(arg)
		}
		const value = cache.get(arg)?.value
		if (!value) return Promise.resolve(value)
		return value as ReturnType<T>
	}
	return { get, revalidate, patch, present }
}


globalThis.BrandCache ||= simpleCache(()=>BrandModel.find())
globalThis.CategoryCache ||= simpleCache(()=>CategoryModel.find())
globalThis.DiscountCache ||= simpleCache(()=>DiscountModel.find())
globalThis.UserCache ||= cacheParam(
	(name: string) => UserModel.findOne({ name }),
	1000 * 10,
	10,
	false
)

export const BrandCache = globalThis.BrandCache as ReturnType<typeof simpleCache<typeof BrandModel["find"]>>
export const CategoryCache = globalThis.CategoryCache as ReturnType<typeof simpleCache<typeof CategoryModel["find"]>>
export const DiscountCache = globalThis.DiscountCache as ReturnType<typeof simpleCache<typeof DiscountModel["find"]>>
export const UserCache = globalThis.UserCache as ReturnType<typeof cacheParam<(name:string)=> ReturnType<typeof UserModel["findOne"]>>>

