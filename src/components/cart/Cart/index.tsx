"use client"
import { getProductsByIdsAction } from "@/actions/product"
import CartRow from "./row"
import { useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { createOrderAction } from "@/actions/order"
import useToast from "@/hooks/modals/useToast"
import calcPrice from "@/helpers/discount"
import dynamic from "next/dynamic"

const Login = dynamic(()=>import("@/components/modals/Login"))


type Props = {
}

export default function Cart() {
	const session = useSession()
	const {handleResponse,error} = useToast()
	const [products, setProducts] = React.useState<PopulatedProduct[]>([])
	const [loading, setLoading] = React.useState(false)
	const items = useCartStore((state) => state.items)
	const itemsSetter = useCartStore((state) => state.setItems)
	const resetCart = () => itemsSetter({})

	async function handleClick() {
		setLoading(true)
		const order: Record<number, { price: number; amount: number }> = {}
		if (Object.keys(items).length === 0) return false
		for (const id in items) {
			const product = products.find((product) => product.id === +id)
			if (!product) {
				error("Some of the products are no longer available","Catalog changed")
				return
			}
			const price = calcPrice(product.price,product.discount.discount)
			const amount = items[+id]
			order[id] = { price, amount }
		}
		if (Object.keys(order).length !== Object.keys(items).length)
			error("Internal Error","Internal Error")

		const res = await createOrderAction(order)
		if (handleResponse(res))
			resetCart()
		setLoading(false)
	}

	const totalAmount = Object.values(items).reduce((sum, next) => sum + next, 0)
	const totalPrice = products.reduce((total, next) => total +
		calcPrice(next.price,next.discount.discount) * items[next.id],0
	)
	React.useEffect(() => {
		async function updateCart() {
			const res = await getProductsByIdsAction(Object.keys(items).map(Number))
			if (handleResponse(res))
				setProducts(res)
		}
		updateCart()
	}, [Object.keys(items).length])
	if (!session?.data?.user?.name){
		error("Only authenticated users","Not Authorized")
	}
	return loading ? (
		<div className="h-8 w-8 animate-spin bg-secondary text-accent">C</div>
	) : (
		<div
			className="
				grid h-fit
				min-h-full w-fit grid-cols-6 grid-rows-[subgrid] items-center
				justify-items-center rounded-sm bg-cyan-500
				p-2 text-2xl 
			"
		>
			{products.map((product) => (
				<CartRow
					className="border-1 h-16 w-full text-2xl"
					key={product.id}
					product={product}
				/>
			))}
			<span className="">Total:</span>
			<div
				className="
					col-span-2  
					col-start-4 grid w-full grid-cols-2
					border-t-2 border-accent1-500
				"
			>
				<span className="text-center">{totalAmount}</span>
				<span className="text-center">{totalPrice}</span>
			</div>
			<button
				disabled={loading}
				onClick={handleClick}
				type="submit"
			>
				Order
			</button>
		</div>
	)
}
