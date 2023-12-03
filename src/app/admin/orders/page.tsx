
import { getServerSession } from 'next-auth'
import Accordion from '@/components/ui/Acordion'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { OrderModel} from '@/lib/DAL/Models'
import { getProducts } from '@/actions/getProducts'
import { PopulatedProduct } from '@/lib/DAL/Models/Product'
import { Order } from '@/lib/DAL/Models/Order'
import Complete from '@/components/ui/Order/Complete'

export default async function Orders() {
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== 'admin') return <div>Unauthorized</div>
	const orders = await OrderModel.custom.getActive()
	const productSet = new Set(orders.flatMap(order => Object.keys(order.order)))
	console.log(productSet)
	const products = await getProducts(Array.from(productSet))
	const populatedOrders: { order: Order, products: PopulatedProduct[] }[] = []
	for (const order of orders) {
		const populatedProducts: PopulatedProduct[] = []
		for (const id in order.order) {
			populatedProducts.push(products.find(prod => +prod.id === +id)!)
		}
		populatedOrders.push({ products: populatedProducts, order })
	}
	console.log(populatedOrders)
	return (
		<>
			{populatedOrders.map(order => (
				<Accordion className='' label={`Order-${order.order.id} - ${order.order.user}`}>
					{[order.products.map(product => (
						<div
							className='grid col-span-5 grid-cols-5'
						>
							<span>{product.id}</span>
							<span>{product.name}</span>
							<span>{product.brand.name}</span>
							<span>{order.order.order[product.id].amount}</span>
						</div>
					)),
						<Complete id={order.order.id}/>
					]}

				</Accordion >
			))
			}
		</>
	)
}
