import { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny } from "zod"
import type { DataModel } from "../base"

type Query<T extends Record<string, unknown>> = {
	[Key in keyof T]?: T[Key] | T[Key][];
};

export class TestModel<
	N extends string,
	_T extends Record<string, unknown>,
	Z extends ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, _T>,
	O extends Z["_type"] & { id: number },
> implements DataModel<O> {
	public filePath: string
	public storage: O[]
	constructor(public name: N, public validation: Z, storage: NoInfer<Record<N, O[]>>) {
		this.storage = storage[name]
	}
	async create(_props: unknown): Promise<O | null> {
		const valResult = await this.validation.parseAsync(_props)
		if (valResult.id && this.storage.find(v => v.id === valResult.id)) {
			throw "Already Exists"
		}
		this.filePath = this.name
		const no = { ...valResult, id: Math.random() }
		this.storage.push(no)
		return no
	}
	async find(query?: Query<O>, page?: number | undefined, skip?: number | undefined): Promise<O[]> {
		if (!query) return Promise.resolve(this.storage)
		return this.storage.filter(i => {
			for (const [key, value] of Object.entries(query)) {
				if (i[key] === value || Array.isArray(value) && value.includes(i[key]))
					return true
				return false
			}
		}).slice(skip || 0, (skip || 0) + (page || 100))
	};
	findOne(query: Query<O>): Promise<O | null> {
		return this.find(query, 1, 0).then(r => r[0])
	};
	delete(id: number): Promise<O | null> {
		const pos = this.storage.findIndex(i => i.id === id)
		if (pos === -1) return Promise.resolve(null)
		const res = this.storage[pos]
		this.storage[pos] = this.storage.at(-1)!
		this.storage.pop()
		return Promise.resolve(res)
	};
	async patch(targid: number, patch: unknown): Promise<O | null> {
		const { data: props, error } = await this.validation.partial().safeParseAsync(patch)
		const origIdx = this.storage.findIndex(i => i.id.toString() === targid.toString())
		if (origIdx === -1) return null
		this.storage[origIdx] = { ...this.storage[origIdx], ...props }
		return this.storage[origIdx]
	}
}
