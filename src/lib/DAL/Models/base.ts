import {
	Column,
	ColumnBuilderBaseConfig,
	ColumnDataType,
	SQL,
	SQLWrapper,
	Table,
	and,
	eq,
	inArray,
	like,
    sql,
} from "drizzle-orm"
import { AnyPgSelect, PgColumnBuilderBase, TableConfig, getTableConfig } from "drizzle-orm/pg-core"
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { ZodObject, z } from "zod"
import { deleteImages } from "@/helpers/images"

export type ColumnsConfig<T extends Record<string, ColumnDataType>> = {
	[Key in keyof T]: PgColumnBuilderBase<ColumnBuilderBaseConfig<T[Key], string>>
}
export type TestColumnsConfig<T, U extends ColumnsConfig<any>> = T extends U
	? T
	: "false"


type Query<T extends Record<string, any> & { id: number }> = {
	[Key in keyof T]?: string | string[] | RegExp
}

export interface DataModel<T extends Record<string, any> & { id: number }> {
	create: (obj: unknown) => Promise<T | null>
	findOne: (query: Query<T>) => Promise<T | null>
	find: (query?: Query<T>) => Promise<T[]>
	delete: (id: number) => Promise<T | null>
	patch: (targid: number, patch: Partial<T>) => Promise<T | null>
	raw: (sql: SQL<any>) => any
}
function normalizeQuery(query: Record<string, number| string | string[] | RegExp|undefined>) {
	const res: [string,typeof query[string]][] = []
	for (const [key, value] of Object.entries(query)) {
		if (!Array.isArray(value))
			res.push([key, value])
		else
			res.push([key, value.sort()])
	}
	return Object.fromEntries(res.sort((a, b) => a[0].localeCompare(b[0])))
}
type CacheEntry = {
	value: Promise<Record<string,any>|Record<string,any>[]> & Promise<{ id: number }>,
	ids: number[],
	created: number
}

export class CacheClass{
	private cacheByQuery: Map<string, CacheEntry>
	private ttl: number = 10 * 60 * 1000
	private maxSize: number = 20

	constructor(maxSize?: number, ttl?: number) {
		if (maxSize) this.maxSize = maxSize
		if (ttl) this.ttl = ttl
		this.cacheByQuery = new Map()
	}

	private deleteStalest() {
		const stalest: { query: string, ttl: number } = { query: "", ttl: -Infinity }
		const now = Date.now()
		for (const [query, value] of this.cacheByQuery.entries()) {
			const ttl = now - value.created
			if (ttl > this.ttl) {
				stalest.query = query
				break
			}
			if (ttl < stalest.ttl) {
				stalest.ttl = ttl
				stalest.query = query
			}
		}
		this.cacheByQuery.delete(stalest.query)
	}

	public async staleIds(ids: number[]) {
		const staleQuerys: string[] = []
		for (const [query, entry] of this.cacheByQuery.entries()) {
			for (const id of entry.ids) {
				if (ids.includes(id)) {
					staleQuerys.push(query)
					break
				}
			}
		}
		for (const query of staleQuerys)
			this.cacheByQuery.delete(query)
	}

	private async addToCache(query: string, value: any) {
		const newEntry: CacheEntry = {
			ids: [value].flat().map(val=>val.id),
			value: Promise.resolve(value),
			created: Date.now()
		}
		if (this.cacheByQuery.size >= this.maxSize)
			this.deleteStalest()
		this.cacheByQuery.set(query, newEntry)
	}

	public async execute<T extends AnyPgSelect>(query: T) {

		const queryStr = JSON.stringify(query.toSQL()) || "~"
		const cached = this.cacheByQuery.get(queryStr)
		if (cached && cached.created + this.ttl > Date.now()){
			return cached.value as Awaited<T>
		}
		const res = await query
		this.addToCache(queryStr, res)
		return res
	}
}



export class PgreModel<
	U extends Table<TableConfig>,
	T extends U["$inferSelect"] & { id: number },
	Z extends ZodObject<any, any, any>
> implements DataModel<T>
{
	public table: U
	public filePath: string
	public model: PostgresJsDatabase
	private validations: ZodObject<any, any, any>

	private cache: CacheClass

	constructor(
		table: U["$inferSelect"] extends T
			? T extends U["$inferSelect"]
			? U
			: never
			: never,
		validations: Z,
	) {

		this.cache = new CacheClass()
		this.table = table
		const config = getTableConfig(table)
		this.validations = validations
		this.filePath = config.name
		this.model = drizzle(
			postgres(),
			{ logger: false}//config.name === "products" ? true : false }
		)
	}



	private makePgreQuery(queryI: Query<T>) {
		const query = normalizeQuery(queryI)
		const sqlQueryWrappers: SQLWrapper[] = []
		for (const [key, value] of Object.entries(query)) {
			if (!(key in this.table && value)) continue
			const column = this.table[key as keyof U] as Column
			if (Array.isArray(value)) sqlQueryWrappers.push(inArray(column, value))
			else if (value instanceof RegExp)
				sqlQueryWrappers.push(like(column, `%${value.toString().slice(1, -1)}%`))
			else sqlQueryWrappers.push(eq(column, value))
		}
		return and(...sqlQueryWrappers)
	}
	
	private async deleteExtra(_files: string | string[], _oldFiles?: string | string[]) {
		const files = [_files].flat()
		let toDelete: string[] = []
		if (!_oldFiles) toDelete.concat(files)
		else {
			const oldFiles = [_oldFiles].flat()
			toDelete.concat(oldFiles.filter(file => !files.includes(file)))
		}
		deleteImages(toDelete, this.filePath)
	}

	async create(obj: unknown | z.infer<Z>) {
		const props = await this.validations.parseAsync(obj) as T
		const res = await this.write(props)
		if (!res && (props.images || props.image))
			this.deleteExtra(props.images as string[] || props.image as string)
		return res ? (res as U["$inferInsert"] as T) : null
	}

	async patch(targId: number, patch: Partial<z.infer<Z>>) {
		if (!targId) return null
		const [original, props] = await Promise.all([
			this.findOne({ id: targId }),
			this.validations.partial().parseAsync(patch)
		])
		if (!original) throw "Not Found"
		const res = await this.model
			.update(this.table)
			.set(props)
			.where(eq(this.table.id, targId))
			.returning()
		if (!res[0] && (props.images || props.image))
			this.deleteExtra(props.images || props.images)
		if (res[0] && (props.images || props.image))
			this.deleteExtra(props.images || props.image, original.image as string || original.images as string[])
		return res.length > 0 ? res[0] as T : null
	}

	async findOne(query: Query<T>) {
		const res = await this.cache.execute(this.model
			.select()
			.from(this.table)
			.where(this.makePgreQuery(query))
			.limit(1))
		return res[0] ? res[0] as T : null
	}

	async find(query?: Query<T>) {
		
		if (!query) {
			return ((await this.model.select().from(this.table)) || []) as T[]
		}

		const req = this.model
			.select()
			.from(this.table)
			.where(this.makePgreQuery(query))
			.limit(10)
		return await this.cache.execute(req) as T[]
	}
	write(object: T) {
		return this.model.insert(this.table).values(object).returning()
	}
	async delete(id: number) {
		if (!id) return null
		const res = await this.model
			.delete(this.table)
			.where(eq(this.table.id, id))
			.returning()
		if (res[0]) this.cache.staleIds([id])
		return res[0] ? res[0] as T : null
	}

	async raw(sql: SQL<any>) {
		return this.model.execute(sql)
	}

}
