import { Schema} from 'mongoose'
import { defaultId, imageMatch } from './common.ts'
import { pgTable, varchar } from 'drizzle-orm/pg-core'

const UserPgreTable = pgTable('user', {
	_id:varchar('_id',{length:24}).primaryKey().unique().notNull(),
	name:varchar('name',{length:64}).unique().notNull(),
	passwordHash:varchar('passwordHash',{length:100}).notNull(),
	image:varchar('image',{length:30}).notNull(),
	cart:varchar('cart',{length:2048}).notNull(),
})

const UserMongoSchema = new Schema({
	_id:{type:String,default:defaultId},
	name:{type:String, required:true, unique:true, minLength:1, maxLength:64},
	passwordHash:{type:String,required:true},
	role:{type:String, default:'user', match:/(user|admin)/},
	image:{type:String, required:true, ...imageMatch},
	cart:{type:String, default:'[]'}
})

export {UserPgreTable, UserMongoSchema}
