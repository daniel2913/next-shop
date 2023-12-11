import { ColumnsConfig, TestColumnsConfig } from "./base"
import { maxSizes, pgreDefaults, shop, validations } from "./common"

type TestType = Readonly<{
	id: "number"
	name: "string"
	description: "string"
	image: "string"
}>

const BrandValidations = {
	id: [],
	name: [validations.length("name", maxSizes.name, 1)],
	description: [validations.length("description", maxSizes.description, 1)],
	image: [validations.imageMatch()],
}

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	description: pgreDefaults.description,
	image: pgreDefaults.image,
}

const BrandPgreTable = shop.table(
	"brands",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export type Brand = typeof BrandPgreTable.$inferSelect

export { BrandPgreTable, BrandValidations }
