import { getOrderByCodeAction as getOrderByCodeAction } from "@/actions/order"
import { CartTable } from "@/components/cart/CartTable"
import { redirect } from "next/navigation"

export default async function TrackPage(props: {
	params: { code: string }
}) {
	if (!props.params.code) redirect("/shop/home")
	const order = await getOrderByCodeAction(props.params.code)
	if ("error" in order) redirect("/shop/home")
	const status = order.order.status
	return (
		<>
			<div className="flex flex-col w-full items-center justify-center">
				<div className="min-w-[45rem] w-3/4">
					<CartTable interactive={false} products={order.products} order={order.order.order} />
					<div className="w-full justify-end mt-4 flex px-4">
						<div className={`px-4 text-2xl rounded-lg  py-2 ${status === "COMPLETED" ? "bg-green-400" : status === "DELIVERING" ? "bg-blue-400" : "bg-yellow-400"}`}>
							{order.order.status}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
