import { getOrdersAction } from "@/actions/order";
import { OrdersTabs } from "@/components/orders/OrdersTabs";
import RequireAuth from "@/providers/RequireAuth";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
	try {
		const orders = await getOrdersAction();
		if ("error" in orders) redirect("/shop/home");
		return (
			<RequireAuth>
				<main className="min-h-screen">
					<OrdersTabs className="text-3xl" orders={orders} />
				</main>
			</RequireAuth>
		);
	} catch {
		redirect("/shop/home");
	}
}
