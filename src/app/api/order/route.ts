import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import { getProducts } from "@/actions/getProducts"
import { OrderModel } from "@/lib/DAL/Models"

function isCorrect(
	body: unknown
): body is Record<number, { amount: number; price: number }> {
	if (typeof body !== "object" || body === null) return false
	if (Object.keys(body).length === 0) return false
	for (const [key, value] of Object.entries(body)) {
		if (Number.isNaN(+key)) return false
		if (typeof value !== "object" || value === null) return false
		if (!("amount" in value && "price" in value)) return false
		if (typeof value.amount !== "number" || typeof value.price !== "number")
			return false
	}
	return true
}

export async function POST(req: NextRequest) {
	const [order, session] = await Promise.all([
		req.json(),
		getServerSession(authOptions),
	])
	if (!session?.user?.id)
		return new NextResponse("Unauthorized", { status: 400 })
	if (!isCorrect(order))
		return new NextResponse("Invalid request", { status: 400 })
	const products = await getProducts(Object.keys(order))
	if (products.length !== Object.keys(order).length)
		return new NextResponse("Some items are not available", {
			status: 400,
		})
	const prices = products.map(
		(product) =>
			product.price - (product.discount.discount * product.price) / 100 ===
			order[product.id].price
	)
	const correct = prices.reduce((prev, cur) => prev && cur, true)
	if (!correct)
		return new NextResponse("Some prices have changed", {
			status: 400,
		})
	const res = await OrderModel.custom.create(session.user.id, order)
	if (!res) return new NextResponse("Unknown Error", { status: 500 })
	return new NextResponse("Successful", { status: 200 })
}
