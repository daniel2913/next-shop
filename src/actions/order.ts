"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Order, OrderModel, ProductModel} from "@/lib/Models"
import { eq, inArray, sql } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { ServerError, auth, modelGeneralAction, modelGeneralActionNoAuth } from "./common"
import { getProductsByIds} from "./product"
import { PopulatedProduct } from "@/lib/Models/Product"
import { toArray } from "@/helpers/misc"


export type PopulatedOrder = {
	order: Order
	products: PopulatedProduct[]
}

export async function getOrdersAction() {
	try {
		const user = await auth()
		let query = OrderModel.model
			.select()
			.from(OrderModel.table)
			.$dynamic()
		if (user.role !== "admin")
			query = query.where(eq(OrderModel.table.user, user.id))
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
	const user = await auth("user")
	const props = {
		order,
		user: user.id,
	}
	return modelGeneralActionNoAuth(OrderModel, props)
}

export async function changeOrderAction(id: number, form: FormData) {
	return modelGeneralAction(OrderModel, form, id)
}

export async function completeOrderAction(id: number) {
	try {
		const [order] = await Promise.all([
			OrderModel.findOne({ id }),
			auth("admin")
		])

		if (!order) throw ServerError.notFound()
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
	if (prodIds.length === 0) return
	await ProductModel.model.execute(sql`
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
}

export async function deleteOrdersAction(inp: number | number[]) {
	try {
		const ids = toArray(inp) 
		if (!ids.length) throw ServerError.invalid()
		await auth("admin")
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
