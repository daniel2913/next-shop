import { Brand, BrandPgreTable } from "./Brand.ts"
import { Category, CategoryPgreTable } from "./Category.ts"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import {
	PgDatabase,
	char,
	integer,
	real,
	smallint,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core"
import { maxSizes, pgreDefaults, validations } from "./common"
import { shop } from "./common.ts"
import { sql } from "drizzle-orm"
import { PostgresJsDatabase } from "drizzle-orm/postgres-js/driver"
import { Discount } from "./Discount.ts"

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
const ProductValidations = {
	id: [validations.id("id")],
	name: [validations.length("name", maxSizes.name, 1)],
	brand: [],
	category: [],
	description: [validations.length("description", maxSizes.description, 1)],
	images: [validations.imagesMatch()],
	price: [validations.value("price", Infinity, 1)],
	votes: [validations.noDefault("votes")],
	voters: [validations.noDefault("voters")],
	rating: [validations.noDefault("rating")],
}

const ProductCustomQueries = {
	openRating:
		(dataBase: PostgresJsDatabase) => async (ids: number[], voter: number) => {
			const res = await dataBase.execute(sql`
				UPDATE shop.products 
					SET 
						votes[cardinality(voters)+1]=null,
						voters[cardinality(voters)+1]=${voter}
					WHERE
								id in (${ids})
							AND
								NOT ${voter} = any(voters)
					RETURNING
						rating, cardinality(voters) as voters;
			`)
			return res.length > 0
				? (res[0] as { rating: number; voters: number })
				: false
		},
	updateRatings:
		(dataBase: PostgresJsDatabase) =>
		async (id: number, vote: number, voter: number) => {
			const res = await dataBase.execute(sql`
				UPDATE shop.products 
					SET 
						votes[array_position(voters,${voter})]=${vote}
					WHERE
							id = ${id}
					RETURNING
						rating, cardinality(voters) as voters;
			`)
			return res.length > 0
				? (res[0] as { rating: number; voters: number })
				: false
		},
}

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
	images: varchar("images", { length: maxSizes.image }).array().notNull(),
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
	category: Category
	discount: Pick<Discount, "discount" | "expires">
	ownVote: number
}

export { ProductPgreTable, ProductValidations, ProductCustomQueries }
