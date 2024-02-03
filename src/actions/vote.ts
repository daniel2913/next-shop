"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProductModel, UserModel} from "@/lib/DAL/Models"
import {inArray, sql} from "drizzle-orm"

export async function getRating(ids:number[]):Promise<Record<number,number>>{
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return {}
	const res = await ProductModel.model
		.select({
			id:ProductModel.table.id,
			votes: ProductModel.table.votes,
			voters:ProductModel.table.voters
		})
		.from(ProductModel.table)
		.where(inArray(ProductModel.table.id,ids))
	const ownVotes = res
		.filter(row=>row.voters.includes(session.user!.id!))
		.map(row=>[row.id,row.votes[row.voters.indexOf(session.user!.id!)!]])
	return Object.fromEntries(ownVotes)
}

async function setRating(id:number,user:number,vote:number){
	const res = await ProductModel.model.execute(sql`
				UPDATE shop.products 
					SET 
						votes[array_position(voters,${user})]=${vote}
					WHERE
							id = ${id}
					RETURNING
						rating, cardinality(voters) as voters;
		`)
	if (!res.length) return null
	return res[0] as {rating:number, voters:number}
}

export async function updateVoteAction(id:number, vote: number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.id) throw "Not Authorized"
	const res1 = await setRating(id,session.user.id,vote)
	if (!res1) throw "Not Authorized"
	return res1
}

