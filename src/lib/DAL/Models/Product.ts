import { Schema } from "mongoose"
import { shop } from "./common.ts"
import { char, integer, json, real, smallint, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { maxSizes, mongoDefaults, pgreDefaults, validations } from "./common"
import { ColumnsConfig,  TestColumnsConfig } from "./base"
import { BrandPgreTable } from "./Brand.ts"
import { CategoryPgreTable } from "./Category.ts"

type TestType = Readonly<{
	_id: "string"
	name: "string"
	brand: "string"
	category: "string"
	description: "string"
	images: "array"
	price: "number"
	discount: "number"
}>

const ProductValidations = {
	_id: [validations._idMatch("_id")],
	name: [validations.length("name", maxSizes.name, 1)],
	brand: [validations._idMatch("brand")],
	category: [validations._idMatch("category")],
	description: [validations.length("description", maxSizes.description, 1)],
	images: [validations.imagesMatch()],
	price: [validations.value("price", Infinity, 1)],
	discount: [validations.value("discount", 99, 0)],
}

const config = {
	_id: pgreDefaults._id,
	name: pgreDefaults.name,
	brand: char("brand", { length: maxSizes._id })
		.notNull()
		.references(() => BrandPgreTable._id),
	category: char("category", { length: maxSizes._id })
		.notNull()
		.references(() => CategoryPgreTable._id),
	description: pgreDefaults.description,
	images: varchar("images", { length: maxSizes.image }).array().notNull(),
	price: real("price").notNull(),
	rating: integer('rating').array(2).default([0,0]).notNull(),
	discount: smallint("discount").notNull(),
}
const ProductPgreTable = shop.table(
	"products",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>,
	(table) => {
		return {
			uq: uniqueIndex().on(table.brand, table.name),
		}
	},
)

export type Product = typeof ProductPgreTable.$inferSelect

const ProductMongoSchema = new Schema<Product>({
	_id: mongoDefaults._id,
	name: mongoDefaults.name,
	brand: { type: String, ref: "Brand", required: true },
	category: { type: String, ref: "Category", required: true },
	description: mongoDefaults.description,
	images: [mongoDefaults.image],
	price: { type: Number, required: true, min: 0 },
	discount: { type: Number, default: 0, max: 100 },
})
ProductMongoSchema.index({ name: 1, brand: 1 }, { unique: true })

export { ProductMongoSchema, ProductPgreTable, ProductValidations }
