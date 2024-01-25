"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProductModel, UserModel} from "@/lib/DAL/Models"
import {sql} from "drizzle-orm"
import { UserCache } from "@/helpers/cachedGeters"

export async function getRating(ids:number[]):Promise<Record<number,number>>{
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return {}
	const res = await ProductModel.raw(sql.raw(`
		SELECT id,votes,voters FROM shop.products
		WHERE id in (${ids});
	`)) as any as [{id:number,votes:(number|null)[],voters:number[]}]
	const ownVotes = res
		.filter(row=>row.voters.includes(session.user!.id!))
		.map(row=>[row.id,row.votes[row.voters.indexOf(session.user!.id!)!]])
	return Object.fromEntries(ownVotes)
}

async function setRating(id:number,user:number,vote:number){
	const res = await ProductModel.raw(sql`
				UPDATE shop.products 
					SET 
						votes[array_position(voters,${user})]=${vote}
					WHERE
							id = ${id}
					RETURNING
						rating, cardinality(voters) as voters;
		`)
	if (!res[0]) return false
	return res[0] as {rating:number, voters:number}
}

export async function updateVoteAction(id:number, vote: number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.id) return "Not Authorized"
	const user = await UserCache.get(session.user.name)
	if (!user) throw "Bad Cache"
	const res1 = await setRating(id,user.id,vote)
	if (!res1) return "Some Error"
	const res2 = await UserModel.raw(sql`
				UPDATE shop.users 
					SET 
						votes= votes || ${{[id]:vote}}::jsonb
					WHERE
							id = ${session.user.id}
					RETURNING
						votes;
	`) as any as {votes:Record<string,number>}[]
	if (!res2[0]) return "Some Error 2"
	UserCache.patch(user.name,{votes:res2[0].votes})
	return res1
}

