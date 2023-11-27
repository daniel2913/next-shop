
import { integer, pgTable, serial, smallint, } from "drizzle-orm/pg-core"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { ProductPgreTable } from "./Product"
import { shop } from "./common"

type TestType = Readonly<{
	id: "number"
	votes: "array"
	voters: "array"
}>

const RatingValidations: Record<keyof Rating, Array<(...args: any) => any>> = {
	id: [],
	votes: [],
	voters: []
}

const config = {
	id: serial("id").notNull().unique().references(() => ProductPgreTable.id),
	votes: smallint("score").notNull().array().default([]),
	voters: smallint("ratings").notNull().array().default([])
}

const RatingPgreTable = shop.table(
	"ratings",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export type Rating = typeof RatingPgreTable.$inferSelect

export { RatingPgreTable, RatingValidations }
