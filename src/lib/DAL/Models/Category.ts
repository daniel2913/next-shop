import { MAX_SIZES, fileSchema, pgreDefaults, shop, validations } from "./common"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { z } from "zod"
import { handleImages } from "@/helpers/images"

type TestType = Readonly<{
	id: "number"
	name: "string"
	image: "string"
}>

const CategoryInsertValidation = z.object({
	name: validations.name,
	image: fileSchema
		.transform(file=>handleImages([file],"categories"))
		.transform(names=>names ? names[0] : "template.jpg")
		.pipe(validations.imageName)
})

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	image: pgreDefaults.image,
}

const CategoryPgreTable = shop.table(
	"categories",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export type Category = typeof CategoryPgreTable.$inferSelect

export { CategoryPgreTable, CategoryInsertValidation}
