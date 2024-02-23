import { getOrdersAction } from "@/actions/order"
import OrdersAdmin from "@/components/admin/orders/OrdersAdmin"
import React from "react"

export default async function AdminOrdersPage() {
	const ordersPromise = getOrdersAction()
	const orders = await ordersPromise
	if ("error" in orders) throw orders.error
	return (
		<OrdersAdmin
			className="w-full"
			orders={orders}
		/>
	)
}
