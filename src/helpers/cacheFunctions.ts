
export function simpleCache<T>(
	func: () => Promise<T>,
	maxLifeTime = 1000 * 60 * 10,
) {
	let cache: Promise<T>;
	let validUntil: number;
	async function revalidate() {
		cache = func();
		validUntil = Date.now() + maxLifeTime;
		return true;
	}
	function get() {
		if (!cache || Date.now() > validUntil) {
			revalidate();
		}
		return cache;
	}
	return { get, revalidate };
}

type Args = string;

export function cacheParam<T>(
	func: (args: Args) => Promise<T>,
	maxLifeTime = 1000 * 60 * 10,
	maxSize = 30,
	stale = false,
) {
	const cache: Map<
		Args,
		{
			value: Promise<T>;
			validUntil: number;
		}
	> = new Map();
	function add(arg: Args) {
		if (cache.size < maxSize) {
			cache.set(arg, {
				value: func(arg),
				validUntil: Date.now() + maxLifeTime,
			});
			return true;
		}
		const stalest: { stalestKey: Args; validUntil: number } = {
			stalestKey: "",
			validUntil: Number.POSITIVE_INFINITY,
		};
		for (const key of cache.keys()) {
			const value = cache.get(key);
			if (!value) {
				stalest.stalestKey = key;
				break;
			}
			if (value.validUntil < stalest.validUntil) {
				stalest.stalestKey = key;
				stalest.validUntil = value.validUntil;
			}
		}
		cache.delete(stalest.stalestKey);
		cache.set(arg, {
			value: func(arg),
			validUntil: Date.now() + maxLifeTime,
		});
	}

	async function revalidate(arg: Args) {
		const cached = cache.get(arg);
		if (!cached) return add(arg);
		cache.set(arg, {
			value: func(arg),
			validUntil: Date.now() + maxLifeTime,
		});
		return true;
	}
	async function patch(arg: Args, patch: Partial<T>) {
		const cached = cache.get(arg);
		if (!cached) return false;
		const value = { ...(await cached.value), ...patch };
		cache.set(arg, {
			value: new Promise((res) => res(value)),
			validUntil: Date.now() + maxLifeTime,
		});
		return true;
	}
	function present(arg: Args) {
		const cached = cache.get(arg);
		if (!cached) return false;
		if (cached.validUntil < Date.now()) {
			cache.delete(arg);
			return false;
		}
		return true;
	}

	async function get(arg: Args) {
		const cached = cache.get(arg);
		if (!cached) add(arg);
		else if (Date.now() > cached.validUntil) {
			if (stale) revalidate(arg);
			else await revalidate(arg);
		}
		const value = cache.get(arg)?.value;
		if (!value) return Promise.resolve(value);
		return value;
	}
	return { get, revalidate, patch, present };
}
