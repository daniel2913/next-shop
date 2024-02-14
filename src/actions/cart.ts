"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserCache } from "@/helpers/cachedGeters"
import { ProductModel, UserModel } from "@/lib/Models"
import { getServerSession } from "next-auth"
import { ServerError } from "./common"

async function validateCart(cart: Record<number, number>) {
	if (Object.keys(cart).length === 0) return cart
	const products = await ProductModel.find({ id: Object.keys(cart).map(Number) })
	if (products.length === Object.keys(cart).length) return cart
	const validCart: Record<number, number> = {}
	for (const prod of products) {
		if (!(prod.id in cart)) throw ServerError.hidden("Bad SQL Validating cart")
		validCart[prod.id] = cart[prod.id]
	}
	return validCart
}

export async function getCartAction() {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.name || session.user.role !== "user") throw ServerError.notAuthed()
		const user = await UserCache.get(session.user.name)
		if (!user) throw "Bad Cache"
		const cart = await validateCart(user.cart)
		if (Object.keys(user.cart).length !== Object.keys(cart).length) {
			const res = await UserModel.patch(user.id, { cart })
			if (res)
				UserCache.patch(user.name, { cart })
			else
				throw ServerError.notFound()
		}
		return cart
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function setCartAction(cart: Record<string, number>) {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.name || session.user.role !== "user") throw ServerError.notAuthed()
		const res = await UserModel.patch(session.user.id, { cart })
		if (res)
			UserCache.patch(session.user!.name, { cart })
		else
			throw ServerError.notFound()
		return false
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}
