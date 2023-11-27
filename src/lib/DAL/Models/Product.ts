import { Brand, BrandPgreTable } from "./Brand.ts"
import { Category, CategoryPgreTable } from "./Category.ts"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { PgDatabase, char, integer, real, smallint, uniqueIndex, varchar } from "drizzle-orm/pg-core"
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
	discounts: "array"
	votes:"array"
	voters:"array"
	rating:"number"
}>

const ProductValidations = {
	id: [validations.id("id")],
	name: [validations.length("name", maxSizes.name, 1)],
	brand: [],
	category: [],
	description: [validations.length("description", maxSizes.description, 1)],
	images: [validations.imagesMatch()],
	price: [validations.value("price", Infinity, 1)],
	discounts: [validations.noDefault('discount')],
	votes: [validations.noDefault('votes')],
	voters:[validations.noDefault('voters')],
	rating:[validations.noDefault('rating')]
}

const ProductCustomQueries = {
	updateRatings: (dataBase:PostgresJsDatabase)=>
		async (id:number,vote:number,voter:number)=>{
			const res = await dataBase.execute(sql`
				UPDATE ratings 
					SET 
						ratings[
							COALESCE(
								ARRAY_POSITION(ratings.voters,${voter}),
								CARDINALITY(ratings.voters)+1
							)
						]=${vote},
						voters[
							COALESCE(
								ARRAY_POSITION(ratings.voters,${voter}),
								CARDINALITY(ratings.voters)+1)
						]=${voter}
					WHERE
						id=${id}
			`)
			return res?.['.count']>0 ? true : false
		}
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
	discounts: smallint("discounts").array().notNull(),
	votes: smallint("votes").array().default([]),
	voters: smallint("voters").array().default([]),
	rating: real("rating").default(0)
}
const ProductPgreTable = shop.table(
	"products",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>,
	(table) => {
		return {
			uq: uniqueIndex().on(table.brand, table.name),
		}
	},
)

export type Product = typeof ProductPgreTable.$inferSelect
export type LeanProduct = Omit<Product,'voters'|'discounts'>
export type PopulatedProduct = Omit<Product,'brand'|'category'|'discounts'|'voters'> & 
{
	brand:Brand
	category:Category
	discount: Discount
}


export { ProductPgreTable, ProductValidations, ProductCustomQueries }