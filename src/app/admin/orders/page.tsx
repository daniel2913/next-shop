import { getOrdersAction } from "@/actions/order";
import OrdersAdmin from "@/components/admin/orders/OrdersAdmin";
import { cookies } from "next/headers";
import React from "react";

export default async function AdminOrdersPage() {
	const orders = await getOrdersAction();

	const cookie = cookies().get("cookie")
	if (cookie) throw "Error"

	if ("error" in orders) throw orders.error;
	return <OrdersAdmin className="w-full" orders={orders} />;
}
