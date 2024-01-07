import { getServerSession } from "next-auth"
import Accordion from "@/components/ui/Acordion"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderModel } from "@/lib/DAL/Models"
import { getProductsByIdsAction } from "@/actions/getProducts"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Order } from "@/lib/DAL/Models/Order"
import Complete from "@/components/ui/Order/Complete"
import { completeOrder } from "@/actions/completeOrder"

type Props = {
	completed:boolean
}

export default async function OrderList({completed}:Props) {
	const session = await getServerSession(authOptions)
	const status = completed ? "COMPLETED" : "PROCESSING"
	if (!session?.user) return <div>Unauthorized</div>
	const orders = session.user.role === "admin"
		? await OrderModel.find({status})
		: await OrderModel.find({user:session.user.id.toString(), status})

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
							session.user?.role==="admin"
							?
							<Complete
								key={order.order.id}
								action={completeOrder.bind(null, data.id)}
							/>
							: <></>
							,
							completed
							?<span>{order.order.rating}</span>
							:<></>
						]}
					</Accordion>
				)
			})}
		</>
	)
}
