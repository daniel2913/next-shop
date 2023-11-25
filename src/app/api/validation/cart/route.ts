import { Item, ProductModel } from "@/lib/DAL/Models"
import { NextRequest, NextResponse } from "next/server"

function isValidCartType(cart: any[]): cart is Item[] {
	if (Array.isArray(cart) && typeof cart[0] === "object") {
		const props = Object.keys(cart[0])
		let valid = true

		for (const prop of props) {
			if (!(prop in Item.prototype)) {
				valid = false
				break
			}
		}
		for (const prop of Object.keys(Item.prototype)) {
			if (!(prop in props)) {
				valid = false
				break
			}
		}
		return valid ? true : false
	}
	return false
}

function serverValidation(cart: Item[]) {
	let validCart: Item[] = []
	for (const i of cart) {
		ProductModel.exists()
	}
	return cart
}

function validateCartCache(cache: any[]) {
	let cart: cartItem[] = []
	if (isValidCartType(cache)) {
		cart = cache
	}
	cart = serverValidation(cart)
}

export async function POST(req: NextRequest) {
	const cache = await req.json()
	validateCartCache(cache)

	return new NextResponse(data, {
		status: 200,
		headers: {
			"Content-Type": "image",
		},
	})
}
