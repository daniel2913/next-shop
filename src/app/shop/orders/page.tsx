import { getOrdersAction } from "@/actions/order";
import { OrdersTabs } from "@/components/orders/OrdersTabs";
import RequireAuthClient from "@/providers/RequireAuth";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
	try {
		const orders = await getOrdersAction();
		if ("error" in orders) redirect("/shop/home");
		return (
			<RequireAuthClient>
				<main className="min-h-screen">
					<OrdersTabs className="text-3xl" orders={orders} />
				</main>
			</RequireAuthClient>
		);
	} catch {
		redirect("/shop/home");
	}
}
