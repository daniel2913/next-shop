import { UserPgreTable } from "./User.ts"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { jsonb, real, smallint, varchar } from "drizzle-orm/pg-core"
import { pgreDefaults, validations } from "./common"
import { shop } from "./common.ts"
import { z } from "zod"
import { getProductsByIdsAction } from "@/actions/product.ts"

type TestType = Readonly<{
	id: "number"
	user: "number"
	rating: "number"
	order: "json"
	status: "string"
}>


const OrderInsertValidation = z.object({
	user:validations.id,
	order:z.record(z.string(),z.object({
		amount:z.number().positive(),
		price:z.number().positive()
	}))
		.refine(async order=>{
			const products = await getProductsByIdsAction(Object.keys(order))
			if (products.length !== Object.keys(order).length) return false
			return products
				.map((product) =>
					product.price - (product.discount.discount * product.price) / 100 
					=== order[product.id].price)
				.reduce((prev,cur)=>prev&&cur,true)
		},"Some order details are out of date"),
	status:z.enum(["PROCESSING","COMPLETED"]).default("PROCESSING")
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
}

export type Order = typeof OrderPgreTable.$inferSelect

const OrderPgreTable = shop.table(
	"orders",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export { OrderPgreTable, OrderInsertValidation}
