import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { Schema } from 'mongoose'
import { defaultId, imageMatch } from './common'

const columns = ['_id','name','description','image'] as const

const BrandPgreTable = pgTable('brand', {
	_id:varchar('_id',{length:24}).primaryKey().unique().notNull(),
	name:varchar('name',{length:64}).unique().notNull(),
	description:varchar('description',{length:1024}).notNull(),
	image:varchar('image',{length:30}).notNull()
})

const BrandMongoSchema = new Schema({
	_id:{type:String, default:defaultId},
	name:{type:String, required:true, unique:true, minLength:1, maxLength:64},
	description:{type:String,required:true, minLength:1, maxLength:1024},
	image:{type:String,required:true, ...imageMatch}
})

export {BrandPgreTable, BrandMongoSchema}