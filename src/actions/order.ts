"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderModel, ProductModel } from "@/lib/DAL/Models"
import { sql } from "drizzle-orm"
import { getServerSession } from "next-auth"

export async function getUserOrders(id?: number) {
	const session = await getServerSession(authOptions)
	if (!(session?.user?.id)) return "Not Authorized"
	if (session.user.role === "user") id = session.user.id
	if (!id) return []
	return await OrderModel.find({ user: id.toString() })
}

export async function completeOrder(id: number) {
	const [session, order] = await Promise.all([
		getServerSession(authOptions),
		OrderModel.findOne({ id: id.toString() })
	])
	if (!session?.user?.role || session.user.role === "admin") return "Not Authorized"
	const prodIds = Object.keys(order.order).map(Number)
	const [res] = await Promise.all([
		OrderModel.patch(id, { status: "COMPLETED" }),
		openRating(prodIds, order.user),
	])
	if (!res) return "Error"
	return false
}

async function openRating(prodIds:number[], userId:number) {
	const res = ProductModel.raw(sql.raw`
				UPDATE shop.products
					SET 
						votes[cardinality(voters)+1]=null,
						voters[cardinality(voters)+1]=${userId}
					WHERE
								id in (${prodIds})
							AND
								NOT ${userId} = ANY(voters)
					RETURNING
						rating, cardinality(voters) as voters;
	`)
}
