"use client"
import { getProductsByIdsAction } from "@/actions/product"
import useCartStore from "@/store/cartStore"
import React from "react"
import { PopulatedProduct } from "@/lib/Models/Product"
import { createOrderAction } from "@/actions/order"
import useToast from "@/hooks/modals/useToast"
import calcPrice from "@/helpers/misc"
import { Button } from "@/components/ui/Button"
import useAction from "@/hooks/useAction"
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea"
import Loading from "@/components/ui/Loading"
import { CartTable } from "./CartTable"

export type Props = {
	products?: PopulatedProduct[]
	order: Record<string, { amount: number; price: number }>
	interactive?: boolean
	className?: string
}
export default function Cart() {
	const items = useCartStore((state) => state.items)
	const [loadingOrder, setLoadingOrder] = React.useState(false)
	const { handleResponse, error } = useToast()
	const _setter = useCartStore((state) => state.setItemsAndUpdate)
	const resetCart = () => _setter({})
	const { value: products, loading } = useAction(
		() => getProductsByIdsAction(Object.keys(items).map(Number)),
		[]
	)
	async function handleClick() {
		if (Object.keys(items).length === 0) return false
		setLoadingOrder(true)
		const order: Record<number, { price: number; amount: number }> = {}
		for (const id in items) {
			const product = products.find((product) => product.id === +id)
			if (!product) {
				error("Some of the products are no longer available", "Catalog changed")
				setLoadingOrder(false)
				return
			}
			const price = calcPrice(product.price, product.discount)
			const amount = items[+id]
			order[+id] = { price, amount }
		}
		if (Object.keys(order).length !== Object.keys(items).length) {
			error("Internal Error", "Internal Error")
			setLoadingOrder(false)
			return
		}
		const res = await createOrderAction(order)
		setLoadingOrder(false)
		if (handleResponse(res)) resetCart()
	}
	const order: React.ComponentProps<typeof CartTable>["order"] = {}
	for (const product of products) {
		order[product.id] = {
			price: calcPrice(product.price, product.discount),
			amount: items[product.id],
		}
	}
	return (
		<div className="flex h-full w-full flex-col items-center justify-center overflow-y-scroll md:h-[70vh] md:w-[60vw] md:overflow-y-hidden">
			<Loading loading={loading}>
				<div className="flex h-full w-full flex-col items-center rounded-md bg-border p-4">
					<ScrollArea className="h-full w-full">
						<CartTable
							interactive
							products={products}
							order={order}
						/>
						<div className="flex justify-end pr-4">
							<Button
								className="px-4  text-3xl font-bold"
								disabled={
									loadingOrder || loading || Object.keys(order).length === 0
								}
								onClick={handleClick}
								type="submit"
							>
								Order
							</Button>
						</div>
					</ScrollArea>
					<div className="flex w-full justify-center"></div>
				</div>
			</Loading>
		</div>
	)
}
