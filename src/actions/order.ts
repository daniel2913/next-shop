"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserCache } from "@/helpers/cachedGeters"
import { Order, OrderModel, ProductModel, User, UserModel } from "@/lib/DAL/Models"
import { sql } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { modelGeneralAction,  modelGeneralActionNoAuth } from "./common"
import { getProductsByIdsAction } from "./product"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"


type PopulatedOrder = {
	order:Order
	products:PopulatedProduct[]
}

export async function getOrdersAction(){
	const session = await getServerSession(authOptions)
	if (!(session?.user?.id)) return {completed:[],processing:[]}
	let orders:Order[] = []
	if (session?.user?.role !== "admin")
		orders = await OrderModel.find({user: session.user.id})
	else orders = await OrderModel.find() 
	const productSet = new Set(
		orders.flatMap((order) => Object.keys(order.order).map(Number))
	)
	const products = await getProductsByIdsAction(Array.from(productSet))
	
	const populatedOrders: {
		completed:PopulatedOrder[]
		processing:PopulatedOrder[]
	} = {completed:[],processing:[]}
	for (const order of orders) {
		const populatedProducts: PopulatedProduct[] = []
		for (const id in order.order) {
			populatedProducts.push(products.find((prod) => +prod.id === +id)!)
		}
		if (order.status==="PROCESSING")
			populatedOrders.processing.push({ products: populatedProducts, order })
		else	
			populatedOrders.completed.push({ products: populatedProducts, order })
	}
	return populatedOrders
}

export async function createOrderAction(order:Record<number,{price:number,amount:number}>) {
	const session = await getServerSession(authOptions)
	if (session?.user?.role!=="user") return "Not Authorized"
	const props = {
		order,
		user: session.user.id,
	}
	return modelGeneralActionNoAuth(OrderModel,props)
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


