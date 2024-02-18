"use server"

import { Order, OrderModel, ProductModel} from "@/lib/Models"
import { eq, inArray, sql, and,not } from "drizzle-orm"
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
	await ProductModel.model
		.update(ProductModel.table)
		.set({
			votes:sql`array_append(votes,null)`,
			voters:sql`array_append(voters,${userId})`
		})
		.where(and(
			inArray(ProductModel.table.id,prodIds),
			sql`NOT ${userId} = ANY(${ProductModel.table.voters})`
		))
		.returning({id:ProductModel.table.id})
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
		return ServerError.fromError(error).emmit()
	}
}

export async function markOrderSeenAction(id:number){
	try{
		const [user,order] = await Promise.all([
			auth("user"),
			OrderModel.findOne({id})
		])
		if (!order) throw ServerError.notFound("Order not found")
		if (order.user !== user.id) throw ServerError.notAllowed("You are not supposed to see that order :(")
		const res = await OrderModel.patch(id,{seen:true})
		if (!res) throw ServerError.unknown("markOrderSeenAction after patch")
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function getOrderNotificationsAction(){
	try{
		const user = await auth("user")
		const res = await OrderModel.find({seen:false,status:"COMPLETED",user:user.id})
		return res.length
	}
	catch (error) {
		ServerError.fromError(error).log()
		return 0
	}

}
