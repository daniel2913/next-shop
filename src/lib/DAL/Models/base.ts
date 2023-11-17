import mongoConnect from '@/lib/mongoConnect'
import pgreConnect from '@/lib/postgressConnect'
import {
	Column,
	ColumnBuilderBaseConfig,
	ColumnDataType,
	InferInsertModel,
	InferSelectModel,
	SQLWrapper,
	Table,
	and,
	eq,
	getTableColumns,
	inArray,
} from 'drizzle-orm'
import { PgColumn, PgColumnBuilderBase, TableConfig } from 'drizzle-orm/pg-core'
import mongoose, { InferSchemaType, Model, Schema } from 'mongoose'
import { defaultId } from './common'

export type ColumnsConfi<T extends Record<string, ColumnDataType>> = Record<
	keyof T,
	PgColumnBuilderBase<ColumnBuilderBaseConfig<ColumnDataType, string>, object>
>

export type ColumnsConfig<T extends Record<string, ColumnDataType>> = {
	[i in keyof T]: PgColumnBuilderBase<ColumnBuilderBaseConfig<T[i], string>>
}
export type TestColumnsConfig<
	T extends any,
	U extends ColumnsConfig<any>,
> = T extends U ? T : 'false'

export type MongoSchema<T extends Record<string, ColumnDataType>> = {
	[i in keyof T]: T[i] extends keyof typeEnum ? typeEnum[T[i]] : unknown
}

export type DataModels = MongoModel<any> | PgreModel<any>

type typeEnum = {
	string: string
	number: number
	array: Array<any>
}

interface DataModel {
	columns: Record<string, any>
	newObject: (obj: any) => Record<string, any> | null
	findOne: (
		query: Record<string, string | string[]>
	) => Promise<Record<string, any>>
	exists: (
		query: Record<string, string | string[]>
	) => Promise<Record<string, any> | false>
	find: (
		query?: Record<string, string | string[]>
	) => Promise<Record<string, any>[]>
	findPaginated: (
		query: Record<string, string | string[]>,
		pageSize: number,
		offset: number
	) => Promise<Record<string, any>[]>
	write: (obj: any) => any //TODO
}

type validator = (value: any) => string | false

export class MongoModel<T extends Schema> implements DataModel {
	private Query: Record<keyof InferSchemaType<T> & string, string | string[]>
	private model: Model<T>
	private validations: Record<keyof InferSchemaType<T>, validator[]>
	public columns: T['paths']

	private makeMongoQuery<T extends Schema>(
		model: Model<T>,
		query: typeof this.Query
	) {
		const res: Partial<
			Record<keyof InferSchemaType<T>, string | string[]>
		> = {}
		for (const [key, value] of Object.entries(query)) {
			if (!(key in model.schema.paths) || !value) continue
			res[key as keyof InferSchemaType<T>] = value
		}
		return res as Record<string, string | string[]>
	}

	constructor(
		model: Model<T>,
		validations: Record<keyof InferSchemaType<T>, validator[]>
	) {
		this.model = model
		this.validations = validations
	}

	async newObject(obj: Omit<InferSchemaType<T>, '_id'> & { _id?: string }) {
		const newObj = new this.model(obj)
		newObj._id = defaultId() as any as mongoose.Types.ObjectId
		const test = newObj.toJSON()
		for (const [column, value] of Object.entries(test)) {
			if (!this.validations[column]) continue
			for (const validator of this.validations[column]) {
				const error = validator(value)
				if (error) throw error
			}
		}
		const res = await this.write(newObj as InferSchemaType<T>)
		return res as InferSchemaType<T> | null
	}

	async findOne(query: typeof this.Query) {
		await mongoConnect()
		return (await this.model
			.findOne(this.makeMongoQuery(this.model, query))
			.lean()
			.exec()) as InferSchemaType<T>
	}
	async exists(query: typeof this.Query) {
		await mongoConnect()
		return (await this.model
			.exists(this.makeMongoQuery(this.model, query))
			.lean()
			.exec()) as InferSchemaType<T> | false
	}
	async find(query: typeof this.Query | undefined) {
		await mongoConnect()
		if (!query) {
			return (await this.model
				.find()
				.lean()
				.exec()) as InferSchemaType<T>[]
		}
		return (await this.model
			.find(this.makeMongoQuery(this.model, query))
			.lean()
			.exec()) as InferSchemaType<T>[]
	}
	async findPaginated(
		query: typeof this.Query,
		pageSize: number,
		offset: number
	) {
		await mongoConnect()
		return (await this.model
			.find(this.makeMongoQuery(this.model, query))
			.limit(pageSize)
			.skip(offset)
			.lean()
			.exec()) as InferSchemaType<T>[]
	}
	async write(object: InferSchemaType<T>) {
		const document = new this.model(object)
		try {
			await document.validate()
		} catch (e) {
			console.log('Pizda')
			return false
		}
		return [await document.save()] as InferSchemaType<T>[]
	}
}

export class PgreModel<T extends Table<TableConfig> & { _id: PgColumn }>
	implements DataModel {
	table: T
	public columns: T['_']['columns']
	private Query: Record<keyof InferSelectModel<T> & string, string | string[]>

	private validations: Record<keyof T['_']['columns'], validator[]>

	constructor(
		table: T,
		validations: Record<keyof T['_']['columns'], validator[]>
	) {
		this.table = table
		this.columns = getTableColumns(table)
		console.log('==>', table)
		this.validations = validations
	}

	private makePgreQuery<T extends TableConfig>(
		model: Table<T>,
		query: typeof this.Query
	) {
		const sqlQueryWrappers: SQLWrapper[] = []
		for (const [key, value] of Object.entries(query)) {
			if (!(key in this.columns) || !value) continue
			const column = model[key as keyof Table<T>] as Column
			if (Array.isArray(value))
				sqlQueryWrappers.push(inArray(column, value))
			else sqlQueryWrappers.push(eq(column, value))
		}
		return and(...sqlQueryWrappers)
	}

	async newObject(obj: Omit<InferInsertModel<T>, '_id'> & { _id?: string }) {
		const newObj = { ...obj }
		newObj._id = defaultId()
		for (const [column, value] of Object.entries(newObj)) {
			if (!this.validations[column]) continue
			for (const validator of this.validations[column]) {
				const error = validator(value)
				if (error) throw error
			}
		}
		const res = await this.write(newObj as InferInsertModel<T>)
		return res as InferInsertModel<T> | null
	}

	async findOne(query: typeof this.Query) {
		return (
			(
				await pgreConnect
					.select()
					.from(this.table)
					.where(this.makePgreQuery(this.table, query))
					.limit(1)
			)[0] || null
		)
	}

	async exists(query: typeof this.Query) {
		return (
			(
				await pgreConnect
					.select()
					.from(this.table)
					.where(this.makePgreQuery(this.table, query))
					.limit(1)
			)[0] || false
		)
	}

	find(query: typeof this.Query | undefined) {
		if (!query) {
			return pgreConnect.select().from(this.table)
		}
		return pgreConnect
			.select()
			.from(this.table)
			.where(this.makePgreQuery(this.table, query))
	}
	findPaginated(query: typeof this.Query, pageSize: number, offset: number) {
		return pgreConnect
			.select()
			.from(this.table)
			.where(this.makePgreQuery(this.table, query))
			.limit(pageSize)
			.offset(offset)
	}
	write(object: InferInsertModel<T>) {
		return pgreConnect
			.insert(this.table)
			.values(object as InferInsertModel<T>)
			.returning()
	}
}
