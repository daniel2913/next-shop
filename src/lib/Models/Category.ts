import { fileSchema, pgreDefaults, shop, validations } from "./common"
import { z } from "zod"
import { handleImages } from "@/helpers/images"

const CategoryInsertValidation = z.object({
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

const CategoryPgreTable = shop.table("categories",config)

export type Category = typeof CategoryPgreTable.$inferSelect

export { CategoryPgreTable, CategoryInsertValidation}
