import { getOrdersAction } from "@/actions/order"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import OrdersAdmin from "@/components/admin/orders/OrdersAdmin"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function AdminOrdersPage() {
	const ordersPromise = getOrdersAction()
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "admin") redirect("/shop/home")
	const orders = await ordersPromise
	if ("error" in orders) throw orders.error
	return (
		<OrdersAdmin
			className="w-full"
			orders={orders}
		/>
	)
}
