import { ProductModel, UserModel } from "@/lib/DAL/Models"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import { UserCache } from "@/helpers/cachedGeters"


function isCart(cart: unknown): cart is Record<number, number> {
	if (typeof cart != "object" || cart === null) return false
	for (const [key, value] of Object.entries(cart)) {
		if (Number.isNaN(+key) || Number.isNaN(+value)) return false
	}
	return true
}

export async function PATCH(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.name) {
		return new NextResponse("Not authorized", { status: 405 })
	}
	const cart = await req.json()
	if (!isCart(cart)) return new NextResponse("Bad Data", { status: 400 })
	try {
		const res = await UserModel.custom.updateCart(session.user.id, cart)
		if (!res) throw "this is me" + res
		UserCache.revalidate(session.user.name)
		return new NextResponse("Cart updated", { status: 200 })
	} catch (error) {
		console.error(error)
		return new NextResponse("Server error", { status: 500 })
	}
}

export async function GET(req: NextRequest) {
	if (!user) throw "Bad Caching!"
	if (user.cart)
		return NextResponse.json(await validateCart(user.cart), {
			status: 200,
		})
	return NextResponse.json([], { status: 404 })
}
