import { getServerSession } from "next-auth"
import Accordion from "@/components/UI/Acordion"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderModel } from "@/lib/DAL/Models"
import { getProductsByIdsAction } from "@/actions/product"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Order } from "@/lib/DAL/Models/Order"
import Complete from "@/components/UI/Order/Complete"
import { completeOrder } from "@/actions/order"

type Props = {
	completed: boolean
}

export default async function OrderList() {
	const session = await getServerSession(authOptions)
	const status = "PROCESSING"
	if (!session?.user) return <div>Unauthorized</div>
	const orders = session.user.role === "admin"
		? await OrderModel.find({ status })
		: await OrderModel.find({ user: session.user.id.toString(), status })

	const productSet = new Set(
		orders.flatMap((order) => Object.keys(order.order))
	)
	const products = await getProductsByIdsAction(Array.from(productSet))
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
							<table 
								key={order.order.id + "table"}
								className="w-full"
								>

								<thead>
									<tr
										className="flex flex-initial justify-evenly justify-items-center"
									>
										<th className="basis-1/12">ID</th>
										<th className="basis-1/3">Product Name</th>
										<th className="basis-1/4">Brand</th>
										<th className="basis-1/12">Amount</th>
									</tr>
								</thead>
								<tbody>
									{order.products.map((product) => {
										return (
											<tr
												key={`${product.id}-${order.order.id}`}
												className="flex justify-evenly justify-items-center"
											>
												<td className="basis-1/12 text-center">{product.id}</td>
												<td className="basis-1/3 text-center">{product.name}</td>
												<td className="basis-1/4 text-center">{product.brand.name}</td>
												<td className="basis-1/12 text-center">{order.order.order[product.id].amount}</td>
											</tr>
										)
									})}
								</tbody>
							</table>,
							session.user?.role === "admin"
								?
								<div className="w-full flex justify-center">
								<Complete
									className="bg-cyan-200 shadow-none text-black hover:shadow-none hover:bg-cyan-300"
									key={order.order.id}
									action={completeOrder}
									id = {order.order.id}
								/>

								</div>
								: <></>
						]}
					</Accordion>
				)
			})}
		</>
	)
}
