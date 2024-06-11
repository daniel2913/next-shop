import { resolveImageConflict } from "@/helpers/resolveImagesConflict"

const testFile1 = new File([], "test1")
const testFile2 = new File([], "test2")

it.concurrent("Positively handles single brand new object", () => {
	const { toKeep, toDelete, newFiles } = resolveImageConflict([testFile1])
	expect(toKeep).toHaveLength(0)
	expect(toDelete).toHaveLength(0)
	expect(newFiles).toEqual([testFile1])
})
it.concurrent("Positively handles multiple brand new objects", () => {
	const { toKeep, toDelete, newFiles } = resolveImageConflict([testFile1, testFile1, testFile1])
	expect(toKeep).toHaveLength(0)
	expect(toDelete).toHaveLength(0)
	expect(newFiles).toEqual([testFile1, testFile1, testFile1])
})

it.concurrent("Negatively handles single brand new object", () => {
	expect(()=>resolveImageConflict(["test"])).toThrow()
})
it.concurrent("Negatively handles multiple brand new objects", () => {
	expect(()=>resolveImageConflict([testFile1, "test", testFile1])).toThrow()
})


it.concurrent("Positively handles single existing object without changes", () => {
	const { toKeep, toDelete, newFiles } = resolveImageConflict(["test"], ["test"])
	expect(toKeep).toHaveLength(1)
	expect(toDelete).toHaveLength(0)
	expect(newFiles).toHaveLength(0)
})
it.concurrent("Positively handles multiple existing objects without changes", () => {
	const { toKeep, toDelete, newFiles } = resolveImageConflict(["test1", "test2"], ["test1", "test2"])
	expect(toKeep).toHaveLength(2)
	expect(toDelete).toHaveLength(0)
	expect(newFiles).toHaveLength(0)
})

it.concurrent("Positively handles single existing object with changes", () => {
	const { toKeep, toDelete, newFiles } = resolveImageConflict([testFile1], ["not a test"])
	expect(toKeep).toHaveLength(0)
	expect(toDelete).toHaveLength(1)
	expect(newFiles).toEqual([testFile1])
})
it.concurrent("Positively handles multiple existing object with changes", () => {
	const { toKeep, toDelete, newFiles } = resolveImageConflict([testFile1, testFile2, testFile1], ["test1", "not a test"])
	expect(toKeep).toHaveLength(1)
	expect(toDelete).toHaveLength(1)
	expect(newFiles).toEqual([testFile2])
})
