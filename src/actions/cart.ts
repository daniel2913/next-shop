"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserCache } from "@/helpers/cachedGeters"
import { UserModel } from "@/lib/DAL/Models"
import { getServerSession } from "next-auth"

async function validateCart(cart: Record<number, number>) {
	if (Object.keys(cart).length === 0) return cart
	const products = await ProductModel.find({ id: Object.keys(cart) })
	if (products.length === Object.keys(cart).length) return cart
	const validCart: Record<number, number> = {}
	for (const prod of products) {
		if (!(prod.id in cart)) throw "Bad SQL request!"
		validCart[prod.id] = cart[prod.id]
	}
	return validCart
}

export async function getCartAction(){
	const session = await getServerSession(authOptions)
	if (!session?.user?.name || session.user.role !== "user") return {}
	const user = await UserCache.get(session.user.name)
	if (!user) throw "Bad Cache"
	const cart = await validateCart(user.cart)
	if (Object.keys(user.cart).length !== Object.keys(cart).length)
	UserModel.patch(user.id,{cart}).then(_=>UserCache.revalidate(user.name))
	return cart
}

export async function setCartAction(cart:Record<string,number>){
	const session = await getServerSession(authOptions)
	if (!session?.user?.name || session.user.role !== "user") return {}
	UserModel.patch(session.user.id,{cart})
}
