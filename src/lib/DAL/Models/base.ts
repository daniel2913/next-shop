import mongoConnect from '@/lib/mongoConnect'
import pgreConnect from '@/lib/postgressConnect'
import { Column, ColumnBuilderBaseConfig, ColumnDataType, InferInsertModel, InferSelectModel, SQLWrapper, Table, and, eq, inArray} from 'drizzle-orm'
import { PgColumn, PgColumnBuilderBase,TableConfig} from 'drizzle-orm/pg-core'
import mongoose,{InferSchemaType, Model, Schema } from 'mongoose'
import { defaultId } from './common'

export type ColumnsConfig<T extends ReadonlyArray<string>> = Record<T[number], PgColumnBuilderBase<ColumnBuilderBaseConfig<ColumnDataType, string>, object>> 



export type DataModels = MongoModel<any>|PgreModel<any>

interface DataModel{
	columns: Record<string,any>
	findOne:(query:Record<string,string|string[]>)=>Promise<Record<string,any>>
	exists: (query:Record<string,string|string[]>)=>Promise<Record<string,any> | false>
	find:(query?:Record<string,string|string[]>)=>Promise<Record<string,any>[]>
	findPaginated:(query:Record<string,string|string[]>,pageSize:number,offset:number)=>Promise<Record<string,any>[]>
	write:(obj:any)=>any	//TODO
}


export class MongoModel<T extends Schema> implements DataModel{

	private Query:Record<(keyof InferSchemaType<T>)&string,string|string[]>
	private model:Model<T>
	public columns:T['paths']
	
	private makeMongoQuery<T extends Schema>(model:Model<T>,query:typeof this.Query){
		const res:Partial<Record<keyof InferSchemaType<T>,string|string[]>>={}
		for (const [key,value] of Object.entries(query)){
			if (!(key in model.schema.paths) || !value) continue
			res[key as keyof InferSchemaType<T>] = value
		}
		return res as Record<string,string|string[]>
	}

	constructor(model:Model<T>){
		this.model = model
	}
	
	async findOne(query:typeof this.Query){
		await mongoConnect()
		return (await this.model.findOne(this.makeMongoQuery(this.model,query)).lean().exec()) as InferSchemaType<T>
	}
	async exists(query:typeof this.Query){
		await mongoConnect()
		return (await this.model.exists(this.makeMongoQuery(this.model,query)).lean().exec()) as InferSchemaType<T>|false
	}
	async find(query:typeof this.Query | undefined){
		await mongoConnect()
		if (!query){
			return (await this.model.find().lean().exec()) as InferSchemaType<T>[]
		}
		return (await this.model.find(this.makeMongoQuery(this.model,query)).lean().exec()) as InferSchemaType<T>[]
	}
	async findPaginated(query:typeof this.Query,pageSize:number,offset:number){
		await mongoConnect()
		return (await this.model.find(this.makeMongoQuery(this.model,query)).limit(pageSize).skip(offset).lean().exec()) as InferSchemaType<T>[]
	}
	async write(object:Omit<InferSchemaType<T>,'_id'>&{_id?:string}){
		object._id = defaultId()
		const document = new this.model(object)
		try{
			await document.validate()
		}
		catch(e){
			console.log('Pizda')
			return false
		}
		return [await document.save()] as InferSchemaType<T>[]
	}
}


export class PgreModel <T extends Table<TableConfig>&{_id:PgColumn}> implements DataModel{
	table: T
	public columns: T['_']['columns']
	private Query: Record<(keyof InferSelectModel<T>)&string,string|string[]>
	constructor(table:T){
		this.table = table
		this.columns = table._.columns
	}

	private makePgreQuery<T extends TableConfig>(
		model:Table<T>,
		query:typeof this.Query
	){
		const sqlQueryWrappers:SQLWrapper[] = []
		for (const [key,value] of Object.entries(query)){
			if (!(key in model._.columns) || !value) continue
			const column = model[key as keyof Table<T>] as Column
			if (Array.isArray(value)) sqlQueryWrappers.push(inArray(column,value))
			else sqlQueryWrappers.push(eq(column,value))
		}
		return and(...sqlQueryWrappers)
	}

	async findOne(query:typeof this.Query){
		return (await pgreConnect.select().from(this.table).where(this.makePgreQuery(this.table,query)).limit(1))[0] || null
	}

	async exists(query:typeof this.Query){
		return (await pgreConnect.select().from(this.table).where(this.makePgreQuery(this.table,query)).limit(1))[0] || false
	}

	find(query:typeof this.Query | undefined){
		if (!query){
			return pgreConnect.select().from(this.table)
		}
		return pgreConnect.select().from(this.table).where(this.makePgreQuery(this.table,query))
	}
	findPaginated(query:typeof this.Query,pageSize:number,offset:number){
		return pgreConnect.select().from(this.table).where(this.makePgreQuery(this.table,query)).limit(pageSize).offset(offset)
	}
	write(object:Omit<InferInsertModel<T>,'_id'>&{_id?:string}){
		object._id = defaultId()
		return pgreConnect.insert(this.table).values(object as InferInsertModel<T>).returning()
	}
}
