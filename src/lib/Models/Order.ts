import { UserPgreTable } from "./User.ts"
import { boolean, jsonb, smallint, varchar } from "drizzle-orm/pg-core"
import { pgreDefaults, validations } from "./common.ts"
import { shop } from "./common.ts"
import { z } from "zod"
import { getProductsByIdsAction } from "@/actions/product.ts"
import calcPrice from "@/helpers/misc.ts"

const OrderInsertValidation = z.object({
	user: validations.id,
	order: z
		.record(
			z.coerce.number(),
			z.object({
				amount: z.number().positive(),
				price: z.number().positive(),
			})
		)
		.refine(async (order) => {
			const products = await getProductsByIdsAction(
				Object.keys(order).map(Number)
			)
			if ("error" in products) return false
			if (products.length !== Object.keys(order).length) return false
			return products
				.map(
					(product) =>
						calcPrice(product.price, product.discount) ===
						order[product.id].price
				)
				.reduce((prev, cur) => prev && cur, true)
		}, "Some order details are out of date"),
	status: z.enum(["PROCESSING", "COMPLETED"]).default("PROCESSING"),
	seen: z.boolean().default(false),
})

const config = {
	id: pgreDefaults.id,
	user: smallint("user")
		.notNull()
		.references(() => UserPgreTable.id),
	rating: smallint("rating").default(0).notNull(),
	status: varchar("status").default("PROCESSING").notNull(),
	order: jsonb("order")
		.notNull()
		.$type<Record<number, { amount: number; price: number }>>(),
	seen: boolean("seen").default(false),
}

export type Order = typeof OrderPgreTable.$inferSelect

const OrderPgreTable = shop.table("orders", config)

export { OrderPgreTable, OrderInsertValidation }
