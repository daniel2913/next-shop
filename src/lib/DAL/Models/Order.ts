import { UserPgreTable } from "./User.ts"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { jsonb, real, smallint, varchar } from "drizzle-orm/pg-core"
import { pgreDefaults, validations } from "./common"
import { shop } from "./common.ts"
import { sql } from "drizzle-orm"
import { PostgresJsDatabase } from "drizzle-orm/postgres-js/index"
import { argv0 } from "process"

type TestType = Readonly<{
	id: "number"
	user: "number"
	rating: "number"
	order: "json"
	status: "string"
}>

const OrderValidations = {
	id: [validations.id("id")],
	rating: [],
	user: [],
	order: [],
	status: [],
}

export type Order = typeof OrderPgreTable.$inferSelect

const OrderCustomQueries = {
	getActive: (dataBase: PostgresJsDatabase) => async () => {
		const res = await dataBase.execute(sql`
				SELECT * FROM shop.orders 
					WHERE status='PROCESSING';
			`)
		return res.map((res) => ({
			...res,
			order: res.order,
		})) as Order[]
	},

	create:
		(dataBase: PostgresJsDatabase) =>
		async (
			userId: number,
			order: Record<number, { amount: number; price: number }>
		) => {
			const res = await dataBase.execute(sql`
				INSERT INTO shop.orders 
					("user","order","status"
				)
					values(${userId}::smallint,${order}::json,'PROCESSING')
				RETURNING
					id
			`)
			return res.length > 0 ? true : false
		},
}

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
const OrderPgreTable = shop.table(
	"orders",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export { OrderPgreTable, OrderValidations, OrderCustomQueries }
