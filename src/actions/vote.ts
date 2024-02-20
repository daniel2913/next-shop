"use server"
import { ProductModel, User, UserModel } from "@/lib/Models"
import { eq, sql } from "drizzle-orm"
import { ServerError, auth } from "./common"

export async function getUserVotes() {
	try {
		const user = await auth("user")
		return user.votes
	}
	catch (error) {
		const serverError = ServerError.fromError(error)
		return {}
	}
}

async function setVote(id: number, user: number, vote: number) {

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

export async function updateVoteAction(id: number, vote: number,controlledUser?:User) {
	try {
		if (vote<0 || vote>5) throw ServerError.invalid("Vote must be beetween 0 and 5")
		const user = controlledUser || await auth("user")
		let value = user.saved[id] || 0
		value = vote - value
		return UserModel.model.transaction(async (tx)=>{
			const res1 = await tx
				.update(UserModel.table)
				.set({
					votes:sql`${UserModel.table.votes} || ${{[id]:vote}}`
				})
				.where(eq(UserModel.table.id,user.id))
				.returning({id:UserModel.table.id})
			if (res1.length!==1) {
				tx.rollback()
				throw ServerError.unknown("In transaction")
			}
			if (vote===0) return
			const res2 = await tx
				.update(ProductModel.table)
				.set({
					votes:sql`${ProductModel.table.votes}+${value}`,
					voters: vote === value
						? sql`${ProductModel.table.voters}+1)`
						: undefined
				})
				.where(eq(ProductModel.table.id,id))
				.returning({rating:ProductModel.table.rating,voters:ProductModel.table.voters})
			if (res2.length!==1){
				tx.rollback()
				throw ServerError.unknown("In transaction")
			}
			return res2[0]
		}
		)
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

