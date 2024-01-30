"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserCache } from "@/helpers/cachedGeters"
import { OrderModel, ProductModel, User, UserModel } from "@/lib/DAL/Models"
import { sql } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { modelGeneralAction } from "./common"

export async function getUserOrders(id?: number) {
	const session = await getServerSession(authOptions)
	if (!(session?.user?.id)) return "Not Authorized"
	if (session.user.role === "user") id = session.user.id
	if (!id) return []
	return await OrderModel.find({user: id})
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
		OrderModel.findOne({id})
	])
	
	if (!order) return "Order Not Found"
	if (!session?.user?.role || session.user.role !== "admin") return "Not Authorized"
	const user = await UserModel.findOne({id:order.user})
	if (!user) return "User Not Found"
	const newProds = Object.keys(order.order)
		.filter(prod=>!Object.keys(user.votes).includes(prod))
		.map(Number)
	const [res] = await Promise.all([
		OrderModel.patch(id, { status: "COMPLETED" }),
		openRating(newProds, user),
	])
	if (!res) return "Error"
	UserCache.revalidate(user.name)
	return false
}

async function openRating(prodIds:number[], user:User) {
	if (prodIds.length === 0) return
	const res = await ProductModel.model.execute(sql`
				UPDATE shop.products
					SET 
						votes[cardinality(voters)+1]=null,
						voters[cardinality(voters)+1]=${user.id}
					WHERE
								id in ${prodIds}
							AND
								NOT ${user.id} = ANY(voters)
					RETURNING
						id;
	`)
	if (!res.length) return 
	const votes = user.votes
	for (const id of prodIds){
		votes[id] = 0
	}
	UserModel.patch(user.id,{votes}) 
}


