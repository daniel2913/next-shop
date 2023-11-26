
import { Schema } from "mongoose"
import { char, integer, pgTable, } from "drizzle-orm/pg-core"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { maxSizes, mongoDefaults, pgreDefaults, validations } from "./common"
import { ProductPgreTable } from "./Product"

type TestType = Readonly<{
	_id: "string"
	score: "number"
	ratings: "number"
}>

const RatingValidations: Record<keyof Rating, Array<(...args: any) => any>> = {
	_id: [validations._idMatch("_id")],
	product: [validations._idMatch("product")],
	score: [validations.value("score", Infinity, 0)],
	ratings: [validations.value("ratings", Infinity, 0)]
}

const config = {
	_id: pgreDefaults._id,
	product: char("product",{length:maxSizes._id}).notNull().unique().references(()=>ProductPgreTable._id),
	score: integer("score").notNull().default(0),
	ratings: integer("ratings").notNull().default(0)
}

const RatingPgreTable = pgTable(
	"ratings",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>,
)

export type Rating = typeof RatingPgreTable.$inferSelect

const RatingMongoSchema = new Schema<Rating>({
	_id: mongoDefaults._id,
	product: mongoDefaults._id,
	score: { type: Number, required: true },
	ratings: { type: Number, required: true }
})

export { RatingPgreTable, RatingMongoSchema, RatingValidations }
