import { char, jsonb, smallint, varchar } from "drizzle-orm/pg-core"
import { MAX_SIZES, pgreDefaults, shop, validations } from "./common"
import { z } from "zod"

const UserInsertValidation = z.object({
	name:z.string().min(4).max(20),
	passwordHash:z.string().max(MAX_SIZES.hash).min(MAX_SIZES.hash),
	role:z.enum(["user","admin"]).default("user"),
	cart:z.record(z.coerce.number(),z.coerce.number()).default({}),
	saved:z.array(validations.id).default([])
	})

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	passwordHash: char("passwordHash", { length: 64 }).notNull(),
	role: varchar("role", { length: 10 }).notNull(),
	cart: jsonb("cart").notNull().default({}).$type<Record<number, number>>(),
	saved: smallint("saved").array().notNull().default([])
}

const UserPgreTable = shop.table("users",config)

export type User = typeof UserPgreTable.$inferSelect

export { UserPgreTable, UserInsertValidation }
