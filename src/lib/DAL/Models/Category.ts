import { Schema } from 'mongoose'
import { pgTable } from 'drizzle-orm/pg-core'
import {
	maxSizes,
	mongoDefaults,
	pgreDefaults,
	shop,
	validations,
} from './common'
import { ColumnsConfig, MongoSchema, TestColumnsConfig } from './base'

type testType = Readonly<{
	_id: 'string'
	name: 'string'
	image: 'string'
}>

const CategoryValidations = {
	_id: [validations._idMatch('_id')],
	name: [validations.length('name', maxSizes.name, 1)],
	image: [validations.imageMatch()],
}

const config = {
	_id: pgreDefaults._id,
	name: pgreDefaults.name.unique(),
	image: pgreDefaults.image,
}

const CategoryPgreTable = shop.table(
	'categories',
	config as TestColumnsConfig<typeof config, ColumnsConfig<testType>>
)

export type Category = typeof CategoryPgreTable.$inferSelect

const CategoryMongoSchema = new Schema<Category>({
	_id: mongoDefaults._id,
	name: { ...mongoDefaults.name, unique: true },
	image: mongoDefaults.image,
})

export { CategoryPgreTable, CategoryMongoSchema, CategoryValidations }
