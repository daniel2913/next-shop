"use client"
import { getProducts } from "@/actions/getProducts"
import CartRow from "./row"
import { useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"

type Props = {
	close?: () => void
}

export default function Cart({ close }: Props) {
	const session = useSession()
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
			if (!product) return "Error!"
			const price =
				product.price - (product.price * product.discount.discount) / 100
			const amount = items[+id]
			order[id] = { price, amount }
		}
		if (Object.keys(order).length !== Object.keys(items).length)
			return "Error2!"

		const res = await fetch("/api/order", {
			method: "POST",
			body: JSON.stringify(order),
		})
		if (res) resetCart()
		setLoading(false)
	}

	const totalAmount = Object.values(items).reduce((sum, next) => sum + next, 0)
	const totalPrice = products.reduce(
		(total, next) =>
			total +
			(next.price - (next.price * next.discount.discount) / 100) *
				items[next.id],
		0
	)
	React.useEffect(() => {
		async function updateCart() {
			setProducts(await getProducts(Object.keys(items)))
		}
		updateCart()
	}, [Object.keys(items).length])
	if (!session?.data?.user?.name) return false
	return loading ? (
		<div className="h-8 w-8 animate-spin bg-accent1-500">c</div>
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
