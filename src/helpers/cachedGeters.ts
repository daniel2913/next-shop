import {
	BrandModel,
	CategoryModel,
	DiscountModel,
	ProductModel,
	User,
	UserModel,
} from "@/lib/DAL/Models"


export function simpleCache<T extends () => Promise<any>>(
	func: T,
	maxLifeTime = 1000 * 60 * 15
) {
	let cache: ReturnType<T>
	let cacheMap: Map<number, ReturnType<T>> = new Map()
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
export const BrandCache = simpleCache(() => BrandModel.find())
export const CategoryCache = simpleCache(() => CategoryModel.find())
export const DiscountCache = simpleCache(() => DiscountModel.find())

type Args = string

type safeSingleArgs = string & number & RegExp
type safeMultiArgs = Array<safeSingleArgs>
type safeRecordArgs = Record<string | number, safeSingleArgs & safeMultiArgs>
type safeMRecordArgs = Record<string | number, safeRecordArgs>
type SafeArg = safeSingleArgs & safeMultiArgs & safeRecordArgs & safeMRecordArgs
type SafeFunction<T> = (...args: SafeArg[]) => T | T[]

export function cachePar<T extends (arg: Args) => Promise<any>>(
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

export const UserCache = cachePar(
	(name: string) => UserModel.findOne({ name }),
	1000 * 10,
	10,
	false
)



