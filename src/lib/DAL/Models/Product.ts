import { Schema } from 'mongoose'
import { Brand, Category } from './index.ts'
import { defaultId, imageMatch } from './common.ts'
import { pgTable, real, smallint, varchar } from 'drizzle-orm/pg-core'


const ProductPgreTable = pgTable('product', {
	_id:varchar('_id',{length:24}).primaryKey().unique().notNull(),
	name:varchar('name',{length:64}).notNull(),
	brand:varchar('_id',{length:24}).notNull(),
	category:varchar('_id',{length:24}).notNull(),
	description:varchar('description',{length:1024}).notNull(),
	images:varchar('image',{length:30}).notNull().array(),
	price: real('price').notNull(),
	discount: smallint('price').notNull().default(0),
})

const ProductMongoSchema = new Schema({
	_id:{type:String, default:defaultId},
	name:{type:String,required:true, minLength:1, maxLength:64},
	brand:{type:String, ref:'Brand',required:true},
	category:{type:String, ref:'Category',required:true},
	description:{type:String, required:true, maxLength:1024},
	images:[{type:String,required:true,...imageMatch }],
	price:{type:Number, required:true, min:0},
	discount:{type:Number, default:0, max:100},
})
ProductMongoSchema.index({name:1,brand:1},{unique:true})

export {ProductMongoSchema, ProductPgreTable}