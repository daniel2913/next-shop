import { Document, InferSchemaType, Model, Schema } from "mongoose"
import { ColumnsConfig, MongoSchema, TestColumnsConfig } from "./base"
import {
	maxSizes,
	mongoDefaults,
	pgreDefaults,
	shop,
	validations,
} from "./common"

type TestType = Readonly<{
	_id: "string"
	name: "string"
	description: "string"
	image: "string"
}>

const BrandValidations = {
	_id: [validations._idMatch("_id")],
	name: [validations.length("name", maxSizes.name, 1)],
	description: [validations.length("description", maxSizes.description, 1)],
	image: [validations.imageMatch()],
}

const config = {
	_id: pgreDefaults._id,
	name: pgreDefaults.name.unique(),
	description: pgreDefaults.description,
	image: pgreDefaults.image,
}

const BrandPgreTable = shop.table(
	"brands",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>,
)

export type Brand = typeof BrandPgreTable.$inferSelect

const BrandMongoSchema = new Schema<Brand>({
	_id: mongoDefaults._id,
	name: { ...mongoDefaults.name, unique: true },
	description: mongoDefaults.description,
	image: mongoDefaults.image,
})

export { BrandPgreTable, BrandMongoSchema, BrandValidations }
