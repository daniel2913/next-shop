"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderModel, ProductModel} from "@/lib/DAL/Models"
import { getServerSession } from "next-auth"

export async function getUserOrders(id?:number) {
	const session = await getServerSession(authOptions)
	if (!(session?.user?.id)) return false
	if (session.user.role==="user") id=session.user.id
	if (!id) return []
	return await OrderModel.find({user:id.toString()})
}

export async function completeOrder(id: number) {
	const order = await OrderModel.findOne({id:id.toString()})
	if (!order) return false
	const prodIds = Object.keys(order.order).map(Number)
	const [res] = await Promise.all([
		OrderModel.patch(id, { status: "COMPLETED" }),
		ProductModel.custom.openRating(prodIds, order.user),
	])
	return res
}
