import { char, jsonb, smallint, varchar } from "drizzle-orm/pg-core"
import { ColumnsConfig, TestColumnsConfig } from "./base"
import { MAX_SIZES, fileSchema, pgreDefaults, shop, validations } from "./common"
import { sql } from "drizzle-orm"
import { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { z } from "zod"
import { handleImages } from "@/helpers/images"

type TestType = Readonly<{
	id: "number"
	name: "string"
	passwordHash: "string"
	role: "string"
	image: "string"
	cart: "json"
	votes: "json"
	saved: "array"
}>

const UserInsertValidation = z.object({
	name:validations.name,
	passwordHash:z.string().max(MAX_SIZES.hash).min(MAX_SIZES.hash),
	role:z.enum(["user","admin"]).default("user"),
	image:fileSchema
		.transform(file=>handleImages(file,"users"))
		.pipe(validations.imageName.default("template.jpg")),
	cart:z.record(z.string(),z.number()).default({}),
	votes:z.record(z.string(),z.number()).default({}),
	saved:z.array(validations.id).default([])
	})

const UserCustomQuerys = {
	updateVotes:
		(dataBase: PostgresJsDatabase) =>
		async (id: number, votes: Record<number, number>) => {
			const res = await dataBase.execute(sql`
				UPDATE shop.users 
					SET 
						votes= votes || ${votes}::jsonb
					WHERE
							id = ${id}
					RETURNING
						name;
			`)
			return res.length > 0 ? (res[0].name as string) : null
		},
	clearAllSaved:
		(dataBase:PostgresJsDatabase)=>
			async(id:number)=>{
			const res = await dataBase.execute(sql`
				UPDATE shop.users
					SET saved=array_remove(saved,${id}) 
			`)
	},
	deleteSaved:
		(dataBase:PostgresJsDatabase)=>
			async(id:number, user:number)=>{
			const res = await dataBase.execute(sql`
				UPDATE shop.users
					SET saved=array_remove(saved,${id})
				WHERE
					id=${user}
			`)
	},
	addSaved:
		(dataBase:PostgresJsDatabase)=>
			async(id:number, user:number)=>{
			const res = await dataBase.execute(sql`
				UPDATE shop.users
					SET saved=array_append(saved,${id})
				WHERE
					id=${user};
			`)
	}
}

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	passwordHash: char("passwordHash", { length: 64 }).notNull(),
	role: varchar("role", { length: 10 }).notNull(),
	image: pgreDefaults.image,
	cart: jsonb("cart").notNull().default({}).$type<Record<string, number>>(),
	votes: jsonb("votes").notNull().default({}).$type<Record<string, number>>(),
	saved: smallint("saved").notNull().array().default([])
}

const UserPgreTable = shop.table(
	"users",
	config as TestColumnsConfig<typeof config, ColumnsConfig<TestType>>
)

export type User = typeof UserPgreTable.$inferSelect

export { UserPgreTable, UserInsertValidation, UserCustomQuerys }
