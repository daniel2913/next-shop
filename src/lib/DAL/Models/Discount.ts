import { smallint, timestamp } from "drizzle-orm/pg-core"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { maxSizes, pgreDefaults, shop, validations } from "./common"

type TestType = Readonly<{
	id: "number"
	discount: "number"
	products: "array"
	brands: "array"
	categories: "array"
}>

function expiresValidation(name: string) {
	return function (expires: Date) {
		if (expires < new Date())
			return `${name}: expiration date must be in the future`
		return false
	}
}

const DiscountValidations = {
	id: [validations.id("discount")],
	discount: [validations.value("discount", 99, 0)],
	products: [],
	brands: [],
	categories: [],
	expires: [expiresValidation("discount")],
}

const config = {
	id: pgreDefaults.id,
	discount: smallint("discount").notNull().default(0),
	products: smallint("products").array().notNull().default([]),
	categories: smallint("categories").array().notNull().default([]),
	brands: smallint("brands").array().notNull().default([]),
	expires: timestamp("expires")
		.notNull()
		.default(new Date(Date.now() + 5 * 60000)),
}

const DiscountPgreTable = shop.table(
	"discounts",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export type Discount = typeof DiscountPgreTable.$inferSelect

export { DiscountPgreTable, DiscountValidations }
