import { handleImages } from "@/helpers/images"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { fileSchema, pgreDefaults, shop, validations } from "./common"
import { z } from "zod"

type TestType = Readonly<{
	id: "number"
	name: "string"
	description: "string"
	image: "string"
}>

const BrandInsertValidation = z.object({
	name: validations.name,
	description: validations.description,
	image: fileSchema
		.transform(file=>handleImages([file],"brands"))
		.transform(names=>names ? names[0] : "template.jpg")
		.pipe(validations.imageName)
})

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

export { BrandPgreTable, BrandInsertValidation }
