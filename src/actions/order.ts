"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserCache } from "@/helpers/cachedGeters"
import { OrderModel, ProductModel, UserModel } from "@/lib/DAL/Models"
import { sql } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { modelGeneralAction } from "./common"

export async function getUserOrders(id?: number) {
	const session = await getServerSession(authOptions)
	if (!(session?.user?.id)) return "Not Authorized"
	if (session.user.role === "user") id = session.user.id
	if (!id) return []
	return await OrderModel.find({ user: id.toString() })
}

export async function createOrderAction(form: FormData) {
	return modelGeneralAction(OrderModel,form)
}

export async function changeOrderAction(id: number, form: FormData) {
	return modelGeneralAction(OrderModel,form,id)
}

export async function completeOrder(id: number) {
	const [session, order] = await Promise.all([
		getServerSession(authOptions),
		OrderModel.findOne({ id: id.toString() })
	])
	
	if (!order) return "Order Not Found"
	if (!session?.user?.role || session.user.role !== "admin") return "Not Authorized"
	const user = await UserModel.findOne({id:order.user.toString()})
	if (!user) return "User Not Found"
	console.log("<===",order.order, user.votes)
	const newProds = Object.keys(order.order)
		.filter(prod=>!Object.keys(user.votes).includes(prod))
		.map(Number)
	const [res] = await Promise.all([
		OrderModel.patch(id, { status: "COMPLETED" }),
		openRating(newProds, order.user),
	])
	if (!res) return "Error"
	UserCache.revalidate(user.name)
	return false
}

async function openRating(prodIds:number[], userId:number) {
	console.log("==>",prodIds)
	if (prodIds.length === 0) return true 
	const res = await ProductModel.raw(sql`
				UPDATE shop.products
					SET 
						votes[cardinality(voters)+1]=null,
						voters[cardinality(voters)+1]=${userId}
					WHERE
								id in ${prodIds}
							AND
								NOT ${userId} = ANY(voters)
					RETURNING
						id;
	`)
	console.log("opened ",res)
	const newVotes = Object.fromEntries(prodIds.map(id=>[id,0]))
	const res2 = await UserModel.raw(sql`
		UPDATE shop.users
			SET
				votes=votes || ${newVotes}
			WHERE
				id=${userId}
			RETURNING votes;
	`)
	console.log("User ",res2)
}


