import { Brand, BrandPgreTable } from "./Brand.ts"
import { Category, CategoryPgreTable } from "./Category.ts"
import {
	integer,
	real,
	smallint,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core"
import { fileSchema, MAX_SIZES, pgreDefaults, validations} from "./common.ts"
import { shop } from "./common.ts"
import { z } from "zod"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters.ts"
import { handleImages } from "@/helpers/images.ts"
import { toArray } from "@/helpers/misc.ts"


const brandSchema = z
	.string().or(z.number())
	.transform(async(brand)=>{
		const brands = await BrandCache.get()
		if (Number.isNaN(+brand))
			return brands.find(b=>b.name===brand)?.id || -1
		return brands.find(b=>b.id===+brand)?.id || -1
	})
	.refine(n=>n>-1, {message:"Brand Does Not Exist"})

const categorySchema = z
	.string().or(z.number())
	.transform(async(category)=>{
		const categories = await CategoryCache.get()
		let res = -1
		if (Number.isNaN(+category))
			res = categories.find(c=>c.name===category)?.id || -1
		else
			res = categories.find(c=>c.id===+category)?.id || -1
		return res 
	})
	.refine(n=>n>-1, {message:"Category Does Not Exist"})


const ProductInsertValidation = z.object({
	name: validations.name,
	description: validations.description,
	brand: brandSchema,
	category: categorySchema,
	price: z.coerce.number().positive().transform(n=>+n.toFixed(2)),
	images: z.array(fileSchema).or(fileSchema).optional()
		.transform(files=>files
			? handleImages(toArray(files),"products")
			: undefined
		)
		.pipe(z.array(validations.imageName)
		.default(["template.jpg"])
		),
})

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name,
	brand: smallint("brand")
		.notNull()
		.references(() => BrandPgreTable.id),
	category: smallint("category")
		.notNull()
		.references(() => CategoryPgreTable.id),
	description: pgreDefaults.description,
	images: varchar("images", { length: MAX_SIZES.image }).array().notNull(),
	price: real("price").notNull(),
	votes: integer("votes").default(0).notNull(),
	voters: integer("voters").default(0).notNull(),
	rating: real("rating").default(0).notNull(),
}


const ProductPgreTable = shop.table("products",config,
	(table) => {
		return {
			uq: uniqueIndex().on(table.brand, table.name),
		}
	}
)

export type Product = typeof ProductPgreTable.$inferSelect
export type PopulatedProduct = Omit<
	Product,
	"brand" | "category" | "votes"
> & {
	brand: Brand
	category: Category
	discount: number
}

export { ProductPgreTable, ProductInsertValidation}
