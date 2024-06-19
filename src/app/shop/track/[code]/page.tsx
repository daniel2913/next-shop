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
			<main className="size-full flex flex-col items-center justify-center bg-background p-5">
				<div className="md:min-w-[45rem] md:w-3/4">
					<div className="w-full justify-center mb-4 flex">
						<div className={`px-2 md:text-xl rounded-md md:rounded-lg  md:py-1 ${status === "COMPLETED" ? "bg-green-400" : status === "DELIVERING" ? "bg-blue-400" : "bg-yellow-400"}`}>
							{order.order.status}
						</div>
					</div>
					<CartTable interactive={false} products={order.products} order={order.order.order} />
				</div>
			</main>
		</>
	)
}
