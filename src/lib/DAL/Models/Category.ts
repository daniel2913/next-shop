import mongoose, { Schema } from 'mongoose'
import { defaultId, imageMatch } from './common'
import { pgTable, varchar } from 'drizzle-orm/pg-core'



const CategoryPgreTable = pgTable('category', {
	_id:varchar('_id',{length:24}).primaryKey().unique().notNull(),
	name:varchar('name',{length:64}).unique().notNull(),
	image:varchar('image',{length:30}).notNull()
})

const CategoryMongoSchema = new Schema({
	_id:{type:String, default:defaultId},
	name:{type:String,required:true, unique:true, minLength:1, maxLength:64},
	image:{type:String,required:true, ...imageMatch}
})

export {CategoryPgreTable, CategoryMongoSchema}