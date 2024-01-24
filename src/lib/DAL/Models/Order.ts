import { UserPgreTable } from "./User.ts"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { jsonb, real, smallint, varchar } from "drizzle-orm/pg-core"
import { pgreDefaults, validations } from "./common"
import { shop } from "./common.ts"
import { z } from "zod"

type TestType = Readonly<{
	id: "number"
	user: "number"
	rating: "number"
	order: "json"
	status: "string"
}>

const OrderInsertValidation = z.object({
	user:validations.id,
	order:z.record(validations.id,z.object({
		amount:z.number().positive(),
		price:z.number().positive()
	})),
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
