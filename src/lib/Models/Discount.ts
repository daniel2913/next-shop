import { smallint, timestamp } from "drizzle-orm/pg-core"
import { pgreDefaults, shop, validations } from "./common"
import { z } from "zod"
import { BrandCache, CategoryCache } from "@/helpers/cache"
import { toArray } from "@/helpers/misc"

const brandsSchema = z
	.string()
	.or(z.number())
	.or(z.array(z.string()).or(z.array(z.number())))
	.transform(async (brands) => {
		const allBrands = await BrandCache.get()
		const res: number[][] = []
		res.push(
			toArray(brands)
				.filter((brand) => !Number.isNaN(+brand))
				.map((brand) => allBrands.find((b) => b.id === +brand)?.id || -1)
		)
		res.push(
			toArray(brands)
				.filter((brand) => Number.isNaN(+brand))
				.map((brand) => allBrands.find((b) => b.name === brand)?.id || -1)
		)
		return res.flat()
	})
	.refine((n) => n.every((n) => n > -1), { message: "Brand Does Not Exist" })

const categoriesSchema = z
	.string()
	.or(z.number())
	.or(z.array(z.string()).or(z.array(z.number())))
	.transform(async (categories) => {
		const allCategories = await CategoryCache.get()
		const res: number[][] = []
		res.push(
			toArray(categories)
				.filter((category) => !Number.isNaN(+category))
				.map(
					(category) => allCategories.find((b) => b.id === +category)?.id || -1
				)
		)
		res.push(
			toArray(categories)
				.filter((category) => Number.isNaN(+category))
				.map(
					(category) => allCategories.find((b) => b.name === category)?.id || -1
				)
		)

		return res.flat()
	})
	.refine((n) => n.every((n) => n > -1), { message: "Category Does Not Exist" })

const DiscountInsertValidation = z.object({
	discount: z.coerce.number().positive().max(99),
	products: z.array(z.coerce.number()).default([]),
	brands: brandsSchema.default([]),
	categories: categoriesSchema.default([]),
	expires: z.coerce.date().min(new Date()),
})

const config = {
	id: pgreDefaults.id,
	discount: smallint("discount").notNull(),
	products: smallint("products").array().default([]).notNull(),
	categories: smallint("categories").array().default([]).notNull(),
	brands: smallint("brands").array().default([]).notNull(),
	expires: timestamp("expires", { mode: "date" })
		.default(new Date(Date.now() + 5 * 60000))
		.notNull(),
}

const DiscountPgreTable = shop.table("discounts", config)

export type Discount = typeof DiscountPgreTable.$inferSelect

export { DiscountPgreTable, DiscountInsertValidation }
