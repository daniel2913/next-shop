"use server"

import { UserCache } from "@/helpers/cache"
import { ProductModel, UserModel } from "@/lib/Models"
import { ServerError, auth } from "./common"

async function validateCart(cart: Record<number, number>) {
	if (Object.keys(cart).length === 0) return cart
	const products = await ProductModel.find({
		id: Object.keys(cart).map(Number),
	})
	if (products.length === Object.keys(cart).length) return cart
	const validCart: Record<number, number> = {}
	for (const prod of products) {
		if (!(prod.id in cart)) throw ServerError.hidden("Bad SQL Validating cart")
		validCart[prod.id] = cart[prod.id]
	}
	return validCart
}

export async function getUserStateAction() {
	try {
		const user = await auth("user")
		const cart = await validateCart(user.cart)
		if (Object.keys(user.cart).length !== Object.keys(cart).length) {
			const res = await UserModel.patch(user.id, { cart })
			if (res) UserCache.patch(user.name, { cart })
			else throw ServerError.notFound()
		}
		return { cart: cart, saved: user.saved, votes: user.votes }
	} catch {
		return { cart: {}, saved: [], votes: {} }
	}
}

export async function setCartAction(cart: Record<string, number>) {
	try {
		const user = await auth("user")
		const res = await UserModel.patch(user.id, { cart })
		if (res) UserCache.patch(user.name, { cart })
		else throw ServerError.notFound()
		return false
	} catch (error) {
		return ServerError.fromError(error).emmit()
	}
}
