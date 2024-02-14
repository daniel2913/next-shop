"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Order, OrderModel, ProductModel, User, UserModel } from "@/lib/DAL/Models"
import { eq, inArray, sql } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { ServerError, modelGeneralAction, modelGeneralActionNoAuth } from "./common"
import { getProductsByIds, getProductsByIdsAction } from "./product"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"


export type PopulatedOrder = {
	order: Order
	products: PopulatedProduct[]
}

export async function getOrdersAction() {
	try {
		const session = await getServerSession(authOptions)
		if (!(session?.user?.id)) throw ServerError.notAuthed()
		let query = OrderModel.model
			.select()
			.from(OrderModel.table)
			.$dynamic()
		if (session?.user?.role !== "admin")
			query = query.where(eq(OrderModel.table.user, session.user.id))
		const orders = await query
		const productSet = new Set(
			orders.flatMap((order) => Object.keys(order.order).map(Number))
		)

		const products = await getProductsByIds(Array.from(productSet))

		const populatedOrders: {
			completed: PopulatedOrder[]
			processing: PopulatedOrder[]
		} = { completed: [], processing: [] }
		for (const order of orders) {
			const populatedProducts: PopulatedProduct[] = []
			for (const id in order.order) {
				populatedProducts.push(products.find((prod) => +prod.id === +id)!)
			}
			if (order.status === "PROCESSING")
				populatedOrders.processing.push({ products: populatedProducts, order })
			else
				populatedOrders.completed.push({ products: populatedProducts, order })
		}
		return populatedOrders
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function createOrderAction(order: Record<number, { price: number, amount: number }>) {
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "user") return ServerError.notAuthed().emmit()
	const props = {
		order,
		user: session.user.id,
	}
	return modelGeneralActionNoAuth(OrderModel, props)
}

export async function changeOrderAction(id: number, form: FormData) {
	return modelGeneralAction(OrderModel, form, id)
}

export async function completeOrderAction(id: number) {
	try {
		const [session, order] = await Promise.all([
			getServerSession(authOptions),
			OrderModel.findOne({ id })
		])

		if (!order) throw ServerError.notFound()
		if (session?.user?.role !== "admin") throw ServerError.notAllowed()
		const newProds = Object.keys(order.order)
			.map(Number)
		const [res] = await Promise.all([
			OrderModel.patch(id, { status: "COMPLETED" }),
			openRating(newProds, order.user),
		])
		if (!res) throw ServerError.notFound()
		return false
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

async function openRating(prodIds: number[], userId: number) {
	console.log(`Open ${prodIds} for ${userId}`)
	if (prodIds.length === 0) return
	const res = await ProductModel.model.execute(sql`
				UPDATE shop.products
					SET 
						votes=array_append(votes,null),
						voters=array_append(voters,${userId})
					WHERE
								id in ${prodIds}
							AND
								NOT ${userId} = ANY(voters)
					RETURNING
						id;
	`)
	console.log(res)
}

export async function deleteOrdersAction(inp: number | number[]) {
	try {
		const ids = [inp].flat()
		if (!ids.length) throw ServerError.invalid()
		const session = await getServerSession(authOptions)
		if (session?.user?.role !== "admin") throw ServerError.notAllowed()
		const res = await OrderModel.model
			.delete(OrderModel.table)
			.where(inArray(OrderModel.table.id, ids))
			.returning({ id: OrderModel.table.id })
		return res.length
	}
	catch (error) {
		ServerError.fromError(error).emmit()
	}
}
