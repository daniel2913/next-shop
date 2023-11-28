import { char, jsonb, pgTable, varchar } from "drizzle-orm/pg-core"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { maxSizes, pgreDefaults, shop, validations } from "./common"

type TestType = Readonly<{
	id: "number"
	name: "string"
	passwordHash: "string"
	role: "string"
	image: "string"
	cart: "json"
}>

const UserValidations:Record<keyof User,Array<(...args:any)=>any>> = {
	id: [],
	name: [validations.length("name", maxSizes.name, 1)],
	passwordHash: [],
	role: [validations.match("role", /(admin|user)/)],
	image: [validations.imageMatch()],
	cart: [
		validations.length("cart", maxSizes.description),
		validations.match("cart", /^\[.*\]$/),
	],
}

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	passwordHash: char("passwordHash", { length: 64 }).notNull(),
	role: varchar("role", { length: 10 }).notNull(),
	image: pgreDefaults.image,
	cart: jsonb("cart").notNull().default([]).$type<{id:string,amount:number}[]>(),
}

const UserPgreTable = shop.table(
	"users",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>,
)

export type User = typeof UserPgreTable.$inferSelect


export { UserPgreTable, UserValidations }
