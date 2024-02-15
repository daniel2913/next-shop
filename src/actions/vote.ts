"use server"
import { ProductModel } from "@/lib/Models"
import { inArray, sql } from "drizzle-orm"
import { ServerError, auth } from "./common"

export async function getRatingAction(ids: number[]) {
	try {
		const user = await auth("user")
		const res = await ProductModel.model
			.select({
				id: ProductModel.table.id,
				votes: ProductModel.table.votes,
				voters: ProductModel.table.voters
			})
			.from(ProductModel.table)
			.where(inArray(ProductModel.table.id, ids))
		const ownVotes = res
			.filter(row => row.voters.includes(user.id!))
			.map(row => [row.id, row.votes[row.voters.indexOf(user.id!)!] || 0])
		return Object.fromEntries(ownVotes) as Record<number, number>
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

async function setRating(id: number, user: number, vote: number) {
	const res = await ProductModel.model.execute(sql`
	UPDATE shop.products 
		SET 
			votes[array_position(voters,${user})]=${vote}
		WHERE
				id = ${id}
			AND
				${user} = ANY(voters)
		RETURNING
			rating, cardinality(voters) as voters;
		`)
	if (!res.length) throw ServerError.notFound()
	return res[0] as { rating: number, voters: number }
}

export async function updateVoteAction(id: number, vote: number) {
	try {
		const user = await auth("user")
		const res1 = await setRating(id, user.id, vote)
		if (!res1) throw new ServerError("You can only rate existing products that you bought", "Not Authorized")
		return res1
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

