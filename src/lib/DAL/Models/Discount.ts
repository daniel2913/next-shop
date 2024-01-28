import { smallint, timestamp } from "drizzle-orm/pg-core"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { pgreDefaults, shop, validations } from "./common"
import { z } from "zod"
import { BrandCache, CategoryCache} from "@/helpers/cachedGeters"

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

const brandsSchema = z.array(z.string().or(z.number()))
		.transform(async(brands)=>{
			const allBrands = await BrandCache.get()
			const res:number[][] = []
			res.push(brands
				.filter(brand=>typeof brand ==="number") 
				.map(brand=>allBrands.find(b=>b.id===brand)?.id ||-1)
			)
			res.push(brands
				.filter(brand=>typeof brand ==="string")
				.map(brand=>allBrands.find(b=>b.name===brand)?.id ||-1 )
			)
			return res.flat()
		})
		.refine(n=>n.every(n=>n>-1),{message: "Brand Does Not Exist"})


const categoriesSchema = z.array(z.string().or(z.number()))
		.transform(async(categories)=>{
			const allCategories = await CategoryCache.get()
			const res:number[][] = []
			res.push(categories
				.filter(category=>typeof category ==="number") 
				.map(category=>allCategories.find(b=>b.id===category)?.id ||-1)
			)
			res.push(categories
				.filter(category=>typeof category ==="string")
				.map(category=>allCategories.find(b=>b.name===category)?.id ||-1 )
			)
			
			return res.flat()
		})
		.refine(n=>n.every(n=>n>-1),{message: "Category Does Not Exist"})

const DiscountInsertValidation = z.object({
	discount:z.coerce.number().positive().max(99),
	products:z.array(validations.id).optional(),
	brands:brandsSchema, 	
	categories:categoriesSchema,
	expires:z.coerce.date()
})

const config = {
	id: pgreDefaults.id,
	discount: smallint("discount").notNull().default(0),
	products: smallint("products").array().notNull().default([]),
	categories: smallint("categories").array().notNull().default([]),
	brands: smallint("brands").array().notNull().default([]),
	expires: timestamp("expires",{mode:"date"})
		.notNull()
		.default(new Date(Date.now() + 5 * 60000)),
}

const DiscountPgreTable = shop.table(
	"discounts",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export type Discount = typeof DiscountPgreTable.$inferSelect

export { DiscountPgreTable, DiscountInsertValidation }
