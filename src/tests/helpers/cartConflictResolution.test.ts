import { compareCarts, mergeCarts, resolveCartConflict } from "@/helpers/resolveCartConflict"

it.concurrent.each([
	[{ 1: 1, 2: 2 }, { 2: 2, 1: 1 }, true],
	[{ 1: 1, 2: 2, 3: 0 }, { 2: 2, 1: 1 }, true],
	[{}, {}, true],

	[{ 1: 1, 2: 2, 3: 3 }, { 2: 2, 1: 1 }, false],
	[{ 1: 1, 2: 2 }, { 2: 2, 1: 1, 3: 3 }, false],
	[{ 1: 1, 2: 2, 3: 0 }, { 2: 2, 1: 1, 3: 1 }, false],

])("Compares Carts Positevly Correctly", (a, b, exp) => {
	return expect(compareCarts(a, b)).toBe(exp)
})

it.concurrent.each([
	[{}, {}, {}],
	[{ 1: 1 }, { 2: 2 }, { 1: 1, 2: 2 }],
	[{ 1: 1 }, { 1: 1 }, { 1: 2 }],
	[{}, { 1: 1 }, { 1: 1 }]

])("Merges Carts Correctly", (a, b, exp) => {
	return expect(mergeCarts(a, b)).toEqual(exp)
})

it.concurrent.each([
	[{ 1: 1 }, { 1: 1 }, undefined],
	[{}, undefined, undefined],
	[{ 1: 1 }, { 1: 0 }, undefined],

	[{ 1: 0 }, { 1: 1 }, { 1: 1 }],
	[{}, { 1: 1 }, { 1: 1 }],
	[undefined, { 1: 1 }, { 1: 1 }],

	[{ 1: 1 }, { 2: 2 }, { localCart: { 2: 2 }, remoteCart: { 1: 1 }, mergedCarts: { 1: 1, 2: 2 } }],
	[{ 1: 1 }, { 1: 2, 2: 3 }, { localCart: { 1: 2, 2: 3 }, remoteCart: { 1: 1 }, mergedCarts: { 1: 3, 2: 3 } }]

])("Resolves Cart Conflicts correctly", (a, b, exp) => {
	return expect(resolveCartConflict(a, b)).toEqual(exp)
})

