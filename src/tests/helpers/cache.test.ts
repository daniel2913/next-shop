import { cacheParam, simpleCache } from "@/helpers/cacheFunctions"

function _test1() {
	return Promise.resolve(47)
}

const vals: Record<string, number> = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
}

function _test2(name: string) {
	return Promise.resolve(vals[+name])
}

const _mock1 = jest.fn(_test1)
const _mock2 = jest.fn(_test2)


const mock1 = _mock1 as typeof _test1
const mock2 = _mock2 as typeof _test2

jest.useFakeTimers()

it("Simple cache works", () => {
	const cache = simpleCache(mock1, 1000 * 10)
	expect(cache.get()).resolves.toBe(47)
	expect(cache.get()).resolves.toBe(47)
	expect(_mock1.mock.calls.length).toBe(1)

	jest.advanceTimersByTime(1000 * 6)
	expect(cache.get()).resolves.toBe(47)
	expect(_mock1.mock.calls.length).toBe(1)

	jest.advanceTimersByTime(1000 * 6)
	expect(cache.get()).resolves.toBe(47)
	expect(_mock1.mock.calls.length).toBe(2)
	cache.revalidate()
	expect(cache.get()).resolves.toBe(47)
	expect(_mock1.mock.calls.length).toBe(3)
})

it("Parametrized cache works", () => {
	const cache = cacheParam(mock2, 1000 * 10, 3, false)

	expect(cache.get("1")).resolves.toBe(1)
	expect(cache.get("1")).resolves.toBe(1)
	expect(_mock2.mock.calls.length).toBe(1)
	expect(cache.get("2")).resolves.toBe(2)
	expect(_mock2.mock.calls.length).toBe(2)
	expect(cache.get("3")).resolves.toBe(3)
	expect(_mock2.mock.calls.length).toBe(3)
	expect(cache.get("1")).resolves.toBe(1)
	expect(_mock2.mock.calls.length).toBe(3)
	expect(cache.get("4")).resolves.toBe(4)
	expect(_mock2.mock.calls.length).toBe(4)
	expect(cache.get("1")).resolves.toBe(1)
	expect(_mock2.mock.calls.length).toBe(5)

	jest.advanceTimersByTime(1000 * 6)
	expect(cache.get("1")).resolves.toBe(1)
	expect(_mock2.mock.calls.length).toBe(5)
	expect(cache.get("3")).resolves.toBe(3)
	expect(_mock2.mock.calls.length).toBe(5)

	jest.advanceTimersByTime(1000 * 6)
	expect(cache.get("4")).resolves.toBe(4)
	expect(_mock2.mock.calls.length).toBe(6)
})
