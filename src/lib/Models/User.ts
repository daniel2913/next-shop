import { boolean, char, jsonb, smallint, varchar } from "drizzle-orm/pg-core"
import { MAX_SIZES, pgreDefaults, shop, validations } from "./common"
import { z } from "zod"

const UserInsertValidation = z.object({
	name: z.string().min(4).max(20),
	passwordHash: z.string().length(MAX_SIZES.hash),
	role: z.enum(["user", "admin"]).default("user"),
	cart: z.record(
		z.coerce.number().min(0),
		z.coerce.number().min(1)
		).default({}),
	saved: z.array(validations.id).default([]),
	votes: z.record(z.coerce.number(), z.coerce.number()).default({}),
})

const config = {
	id: pgreDefaults.id,
	name: varchar("name", { length: 20 }).notNull(),
	passwordHash: char("passwordHash", { length: 64 }).notNull(),
	role: varchar("role", { length: 10 }).notNull(),
	cart: jsonb("cart").notNull().default({}).$type<Record<string, number>>(),
	saved: smallint("saved").array().notNull().default([]),
	votes: jsonb("votes").notNull().default({}).$type<Record<string, number>>(),
}

const UserPgreTable = shop.table("users", config)

export type User = typeof UserPgreTable.$inferSelect

export { UserPgreTable, UserInsertValidation }
