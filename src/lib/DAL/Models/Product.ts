import { Brand, BrandPgreTable } from "./Brand.ts"
import { Category, CategoryPgreTable } from "./Category.ts"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import {
	integer,
	real,
	smallint,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core"
import { fileSchema, MAX_SIZES, pgreDefaults, validations} from "./common"
import { shop } from "./common.ts"
import { Discount } from "./Discount.ts"
import { z } from "zod"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters.ts"
import { handleImages } from "@/helpers/images.ts"

type TestType = Readonly<{
	id: "number"
	name: "string"
	brand: "number"
	category: "number"
	description: "string"
	images: "array"
	price: "number"
	votes: "array"
	voters: "array"
	rating: "number"
}>

const brandSchema = z
	.string().or(z.number())
	.transform(async(brand)=>{
		const brands = await BrandCache.get()
		let res = -1
		if (typeof brand === "string")
			res = brands.find(b=>b.name===brand)?.id || -1
		else
			res = brands.find(b=>b.id===brand)?.id || -1
		return res 
	})
	.refine(n=>n>-1, {message:"Brand Does Not Exist"})

const categorySchema = z
	.string().or(z.number())
	.transform(async(category)=>{
		const categories = await CategoryCache.get()
		let res = -1
		if (typeof category === "string")
			res = categories.find(c=>c.name===category)?.id || -1
		else
			res = categories.find(c=>c.id===category)?.id || -1
		return res 
	})
	.refine(n=>n>-1, {message:"Category Does Not Exist"})


const ProductInsertValidation = z.object({
	name: validations.name,
	description: validations.description,
	brand: brandSchema,
	category: categorySchema,
	price: z.coerce.number().positive(),
	images: z.array(fileSchema)
		.transform(files=>handleImages(files,"products"))
		.pipe(z.array(validations.imageName)
			.default(["template.jpg"]
		))
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
	votes: integer("votes").array().default([]).notNull(),
	voters: smallint("voters").array().default([]).notNull(),
	rating: real("rating").default(0),
}
const ProductPgreTable = shop.table(
	"products",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>,
	(table) => {
		return {
			uq: uniqueIndex().on(table.brand, table.name),
		}
	}
)

export type Product = typeof ProductPgreTable.$inferSelect
export type LeanProduct = Omit<Product, "voters" | "discounts">
export type PopulatedProduct = Omit<
	Product,
	"brand" | "category" | "votes" | "voters"
> & {
	votes: number
	voters: number
	brand: Brand
	favourite: boolean
	category: Category
	discount: Pick<Discount, "discount" | "expires">
	ownVote: number
}

export { ProductPgreTable, ProductInsertValidation}
