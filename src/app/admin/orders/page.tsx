import { getServerSession } from "next-auth"
import Accordion from "@/components/ui/Acordion"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderModel } from "@/lib/DAL/Models"
import { getProducts } from "@/actions/getProducts"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Order } from "@/lib/DAL/Models/Order"
import Complete from "@/components/ui/Order/Complete"
import { CompleteOrder } from "@/actions/completeOrder"

export default async function Orders() {
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "admin") return <div>Unauthorized</div>
	const orders = await OrderModel.custom.getActive()
	const productSet = new Set(
		orders.flatMap((order) => Object.keys(order.order))
	)
	const products = await getProducts(Array.from(productSet))
	const populatedOrders: {
		order: Order
		products: PopulatedProduct[]
	}[] = []
	for (const order of orders) {
		const populatedProducts: PopulatedProduct[] = []
		for (const id in order.order) {
			populatedProducts.push(products.find((prod) => +prod.id === +id)!)
		}
		populatedOrders.push({ products: populatedProducts, order })
	}
	return (
		<>
			{populatedOrders.map((order) => {
				const data = {
					user: +order.order.user,
					id: +order.order.id,
					prodIds: Object.keys(order.order.order).map(Number),
				}
				return (
					<Accordion
						key={order.order.id}
						className=""
						label={`Order-${order.order.id} - ${order.order.user}`}
					>
						{[
							order.products.map((product) => {
								return (
									<div
										key={`${product.id}-${order.order.id}`}
										className="col-span-5 grid grid-cols-5"
									>
										<span>{product.id}</span>
										<span>{product.name}</span>
										<span>{product.brand.name}</span>
										<span>{order.order.order[product.id].amount}</span>
									</div>
								)
							}),
							<Complete
								key={order.order.id}
								action={CompleteOrder.bind(null, data)}
							/>,
						]}
					</Accordion>
				)
			})}
		</>
	)
}
