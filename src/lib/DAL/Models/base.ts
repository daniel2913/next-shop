import {
	Column,
	ColumnBuilderBaseConfig,
	ColumnDataType,
	SQLWrapper,
	Table,
	and,
	eq,
	inArray,
	like,
} from "drizzle-orm"
import {
	PgColumnBuilderBase,
	PgSelect,
	TableConfig,
} from "drizzle-orm/pg-core"
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

export type ColumnsConfig<T extends Record<string, ColumnDataType>> = {
	[Key in keyof T]: PgColumnBuilderBase<ColumnBuilderBaseConfig<T[Key], string>>
}
export type TestColumnsConfig<T, U extends ColumnsConfig<any>> = T extends U
	? T
	: "false"

export type DataModels = PgreModel<any, any>

type Query<T extends Record<string, any> & { id: number }> = Partial<{
	[Key in keyof T]: string | string[] | RegExp
}>

type Select<T extends Record<string, any> & { id: number }> = Partial<{
	[Key in keyof T as string]:Key
}>

type Validator<T> = (value: T) => string | false


interface DataModel<T extends { [i: string]: any; id: number }> {
	columns: T
	newObject: (obj: Record<string, any>) => Promise<T | null>
	findOne: (query: Query<T>, select?: Select<T>) => Promise<T | null>
	find: (query?: Query<T>, select?: Select<T>) => Promise<T[]>
	findPaginated: (
		pageSize: number,
		offset: number,
		query?: Query<T>,
		select?: Select<T>,
	) => Promise<T[]>
	delete: (id: number) => Promise<boolean>
	patch: (targid: number, patch: Partial<T>) => Promise<boolean>
}

export class PgreModel<
	T extends { [i: string]: any; id: number },
	U extends Table<TableConfig>,
	E extends  Record<string,(db:PostgresJsDatabase)=>(...args:any)=>any> = never,
> implements DataModel<T>
{
	private table: U
	public columns: T
	private model: PostgresJsDatabase
	private validations: { [Key in keyof T]: Validator<T[Key]>[] }
	public custom:{[Key in keyof E]:ReturnType<E[Key]>}
	constructor(
		table: U["$inferSelect"] extends T
			? T extends U["$inferSelect"]
				? U
				: never
			: never,
		validations: { [Key in keyof T]: Validator<T[Key]>[] },
		custom?: E
	) {
		this.table = table
		this.columns = table as any as T
		this.validations = validations
		this.model = drizzle(
			postgres(process.env.PGRE_URL_DEV, { max: 5, idle_timeout: 60 * 2 }),
			{ logger: true },
		)
		if (custom){
			this.custom = {}
			for(const [name,func] of Object.entries(custom)){
				this.custom[name as keyof E] = func(this.model)
			}  
		}

	}

	private isValid(newObj: Record<string, any>): newObj is T {
		for (const [column, value] of Object.entries(newObj)) {
			if (!this.validations[column]) continue
			for (const validator of this.validations[column]) {
				const error = validator(value)
				if (error) throw error
			}
		}
		return true
	}


	private makePgreSelect(select: Select<T>){
		const validSelect:Select<T> = {}
		for (const key in select){
			if (select[key] in this.table) validSelect[key]=this.table[select[key]]
		}
		return validSelect
	}

	private makePgreQuery(query: Query<T>) {
		const sqlQueryWrappers: SQLWrapper[] = []
		for (const [key, value] of Object.entries(query)) {
			if (!(key in this.columns && value)) continue
			const column = this.table[key as keyof U] as Column
			if (Array.isArray(value)) sqlQueryWrappers.push(inArray(column, value))
			else if (value instanceof RegExp)
				sqlQueryWrappers.push(like(column, `${value.toString().slice(1, -1)}%`))
			else sqlQueryWrappers.push(eq(column, value))
		}
		return and(...sqlQueryWrappers)
	}

	async newObject(obj: Record<string, any>) {
		const newObj:any = {}
		for (const key in obj){
			if (key in this.table && key!='id'){
				newObj[key] = obj[key]
			}
		}
		newObj.id = undefined
		if (this.isValid(newObj)) {
			const res = await this.write(newObj as T)
			return res ? (res as U["$inferInsert"] as T) : false
		}
		return false
	}

	async findOne(query: Query<T>) {
		const res = await this.model
			.select()
			.from(this.table)
			.where(this.makePgreQuery(query))
			.limit(1)
		return res[0]
			? res[0] as T
			: null
	}

	async find(query?: Query<T>) {
		if (!query) {
			return ((await this.model.select().from(this.table)) || []) as T[]
		}
		return (await this.model
			.select()
			.from(this.table)
			.where(this.makePgreQuery(query))) as T[]
	}
	async findPaginated(pageSize: number, offset: number,select?:Select<T>, query?: Query<T>,) {
		return (await this.model
			.select()
			.from(this.table)
			.where(this.makePgreQuery(query))
			.limit(pageSize)
			.offset(offset)) as T[]
	}
	write(object: T) {
		return this.model.insert(this.table).values(object).returning()
	}
	async delete(id: number) {
		if (!id) return false
		const res = await this.model
			.delete(this.table)
			.where(eq(this.table.id, id))
			.returning()
		return res.length > 0 ? true : false
	}
	async patch(targId: number, patch: Partial<T>) {
		if (!targId) return false
		const newObj = { ...patch, id: targId }
		if (this.isValid(newObj)) {
			const res = await this.model
				.update(this.table)
				.set(newObj)
				.where(eq(this.table.id, targId))
				.returning({ id: this.table.id })
			return res.length > 0 ? true : false
		}
		return false
	}
}
