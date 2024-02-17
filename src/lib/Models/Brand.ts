import { handleImages } from "@/helpers/images"
import { fileSchema, pgreDefaults, shop, validations } from "./common"
import { z } from "zod"

const BrandInsertValidation = z.object({
	name: validations.name,
	image: fileSchema.optional()
		.transform(file=>file 
			?handleImages([file],"brands")
			:undefined
		)
		.transform(names=>names ? names[0] : "template.jpg")
		.pipe(validations.imageName)
})

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	image: pgreDefaults.image,
}

const BrandPgreTable = shop.table("brands",config)

export type Brand = typeof BrandPgreTable.$inferSelect

export { BrandPgreTable, BrandInsertValidation }
