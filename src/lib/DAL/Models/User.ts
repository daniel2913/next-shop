import { Schema} from 'mongoose'
import { defaultId } from './common.ts'
import { char, pgTable, varchar } from 'drizzle-orm/pg-core'
import { ColumnsConfig, MongoSchema, TestColumnsConfig } from './base'
import { maxSizes, mongoDefaults, pgreDefaults, validations } from './common'

type testType = Readonly<{
	_id:"string"
	name:"string"
	passwordHash:"string"
	role:"string"
	image:"string"
	cart:"string"
}>

const UserValidations = {
	_id:[validations._idMatch('_id')],
	name: [validations.length('name',maxSizes.name,1)],
	passwordHash: [validations.match('passwordHash',/^[0-9 a-f A-F]{64}$/)],
	role: [validations.match('role',/(admin|user)/)],
	image: [validations.imageMatch()],
	cart: [validations.length('cart',2048),validations.match('cart',/^\[.*\]$/)]
}

const config = {
	_id:pgreDefaults._id,
	name:pgreDefaults.name.unique(),
	passwordHash:char('passwordHash',{length:64}).notNull(),
	role:varchar('role',{length:10}).notNull(),
	image:pgreDefaults.image,
	cart:varchar('cart',{length:2048}).notNull(),
}

const UserPgreTable = pgTable('user', config as TestColumnsConfig<typeof config, ColumnsConfig<testType>>)

const UserMongoSchema = new Schema<MongoSchema<testType>>({
	_id:mongoDefaults._id,
	name:{...mongoDefaults.name, unique:true},
	passwordHash:{type:String,required:true},
	role:{type:String, required:true},
	image:mongoDefaults.image,
	cart:{type:String, required:true}
})

export {UserPgreTable, UserMongoSchema, UserValidations}
