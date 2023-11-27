import {
	maxSizes,
	pgreDefaults,
	shop,
	validations,
} from "./common"
import { ColumnsConfig, TestColumnsConfig } from "./base"

type TestType = Readonly<{
	id: "number"
	name: "string"
	image: "string"
}>

const CategoryValidations = {
	id: [],
	name: [validations.length("name", maxSizes.name, 1)],
	image: [validations.imageMatch()],
}

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	image: pgreDefaults.image,
}

const CategoryPgreTable = shop.table(
	"categories",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>,
)

export type Category = typeof CategoryPgreTable.$inferSelect


export { CategoryPgreTable, CategoryValidations }
