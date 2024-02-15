import {
	Column,
	SQLWrapper,
	and,
	eq,
	inArray,
	ilike,
} from "drizzle-orm"
import { PgColumn, PgTableWithColumns, getTableConfig } from "drizzle-orm/pg-core"
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { ZodObject, z } from "zod"
import { ServerError } from "@/actions/common"


type Query<T extends Record<string, any> & { id: number }> = {
	[Key in keyof T]?:
	| T[Key]
	| T[Key][]
}

export interface DataModel<T extends Record<string, any> & { id: number }> {
	create: (obj: unknown | T) => Promise<T | null>
	findOne: (query: Query<T>) => Promise<T | null>
	find: (query?: Query<T>, page?: number, skip?: number) => Promise<T[]>
	delete: (id: number) => Promise<T | null>
	patch: (targid: number, patch: unknown | Partial<T>) => Promise<T | null>
}

type BasePgTable = PgTableWithColumns<{
	name: string;
	schema: string;
	columns: {
		id: PgColumn<{
			name: "id";
			tableName: string;
			dataType: "number";
			columnType: "PgSmallInt";
			data: number;
			driverParam: string | number;
			notNull: true;
			hasDefault: true;
			enumValues: undefined;
			baseColumn: never;
		}, {}, {}>;
	};
	dialect: "pg";
}>

export class PgreModel<
	U extends BasePgTable,
	Z extends ZodObject<any, any, any, U["$inferInsert"]>
> implements DataModel<U["$inferSelect"]>
{
	public table: U
	public filePath: string
	public model: PostgresJsDatabase
	private validations: ZodObject<any, any, any>

	constructor(
		table: U,
		validations: ZodObject<any, any, any, U["$inferInsert"]>,
	) {

		this.table = table
		const config = getTableConfig(table)
		this.validations = validations
		this.filePath = config.name
		this.model = drizzle(
			postgres(),
			{ logger: false }
		)
	}

	private makePgreQuery(query: Query<U["$inferSelect"]>) {
		const sqlQueryWrappers: SQLWrapper[] = []
		for (const [key, value] of Object.entries(query)) {

			if (!(key in this.table && value)) continue

			const column = this.table[key as keyof U] as Column
			if (Array.isArray(value)) sqlQueryWrappers.push(inArray(column, value))
			else if (typeof value === "string" && value.at(0) === "%" && value.at(-1) === "%")
				sqlQueryWrappers.push(ilike(column, value))
			else sqlQueryWrappers.push(eq(column, value))
		}
		return and(...sqlQueryWrappers)
	}

	async create(obj: unknown | U["$inferSelect"]) {
		const props = await this.validations.parseAsync(obj) as U["$inferInsert"]
		const res = await this.model.insert(this.table).values(props).returning()
		return res[0] ? res[0] as U["$inferSelect"] : null
	}

	async patch(targId: number, patch: Partial<z.infer<Z>> | unknown) {
		if (!targId) throw ServerError.invalid()
		const [original, props] = await Promise.all([
			this.findOne({ id: targId }),
			this.validations.partial().parseAsync(patch)
		])
		if (!original) throw ServerError.notFound()
		const res = await this.model
			.update(this.table)
			.set(props)
			.where(eq(this.table.id, targId))
			.returning()
		return res[0] ? res[0] as U["$inferSelect"] : null
	}

	async findOne(query: Query<U["$inferSelect"]>) {
		const res = await this.model
			.select()
			.from(this.table)
			.where(this.makePgreQuery(query))
			.limit(1)
		return res[0] ? res[0] : null
	}

	async find(query?: Query<U["$inferSelect"]>, page = 20, skip = 0) {
		let req = this.model.select().from(this.table).$dynamic()
		if (query) req = req.where(this.makePgreQuery(query))
		if (page) req = req.limit(page)
		if (skip) req = req.offset(skip)
		return await req
	}

	async delete(id: number) {
		if (!id) return null
		const res = await this.model
			.delete(this.table)
			.where(eq(this.table.id, id))
			.returning()
		return res[0] ? res[0] as U["$inferSelect"] : null
	}
}
