"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProductModel} from "@/lib/DAL/Models"
import {sql} from "drizzle-orm"
import { UserCache } from "@/helpers/cachedGeters"

export async function getRating(ids:number[]):Promise<Record<number,number>>{
	const session = await getServerSession(authOptions)
	console.log(ids);
	if (!session?.user?.role || session.user.role!=="user") return {}
	const res = await ProductModel.raw(sql.raw(`
		SELECT id,votes,voters FROM shop.products
		WHERE id in (${ids});
	`)) as any as [{id:number,votes:(number|null)[],voters:number[]}]
	console.log(res)
	const ownVotes = res
		.filter(row=>row.voters.includes(session.user!.id!))
		.map(row=>[row.id,row.votes[row.voters.indexOf(session.user!.id!)!]])
	return Object.fromEntries(ownVotes)
}

export async function setRating(id:number,vote:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return false

	const user = await UserCache.get(session.user.name)
	if (!user) return false
	const res = await ProductModel.custom.updateRatings(
		id,
		vote,
		user.id
	)
	if (!res) return false
	return res
}
