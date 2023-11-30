import { UserModel } from "@/lib/DAL/Models"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import { UserCache } from "@/helpers/cachedGeters"

export async function PATCH(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.name) {
		return new NextResponse("Not authorized", { status: 405 })
	}
	const cart = await req.json()
	console.log(cart)
	try {
		const res = await UserModel.patch(
			session.user.id,
			{ cart: cart },
		)
		if (!res) throw res

		if (UserCache.present(session.user.name)) UserCache.patch(session.user.name, { cart })
		
		return new NextResponse("Cart updated", { status: 200 })
	} catch (error) {
		return new NextResponse("Server error", { status: 500 })
	}
}

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.name) {
		return new NextResponse(JSON.stringify([]), { status: 404 })
	}
	const user = await UserCache.get(session.user.name)
	if (user.cart) return new NextResponse(JSON.stringify(user.cart), { status: 200 })
	return new NextResponse(JSON.stringify([]), { status: 404 })
}
