"use client"
import { getProductsByIdsAction } from "@/actions/product"
import useCartStore from "@/store/cartStore"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { createOrderAction } from "@/actions/order"
import useToast from "@/hooks/modals/useToast"
import calcPrice from "@/helpers/discount"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table"
import Image from "next/image"
import AmmountSelector from "@/components/UI/AmmountSelector"
import { Button } from "@/components/UI/button"
import useAction from "@/hooks/useAction"
import { ScrollArea, ScrollBar } from "@/components/UI/scroll-area"
import Loading from "@/components/UI/Loading"

type Props = {
	products: PopulatedProduct[]
	order: Record<string, { amount: number, price: number }>
	interactive?: boolean
}
export function CartTable({ products, order, interactive }: Props) {
	const totalAmount = Object.values(order).reduce((sum, next) => sum + next.amount, 0)
	const totalPrice = Object.values(order).reduce((total, next) => total + next.price, 0)
	const setter = useCartStore(state => state.setAmmount)
	return (
		<>
			<Table className="table-auto w-fit">
				<TableHeader>
					<TableRow className=" *:p-1 *:text-center text-center text-xl sm:text-2xl text-accent">
						<TableHead className="w-1/6">
							Image
						</TableHead>
						<TableHead className="w-1/5">
							Product
						</TableHead>
						<TableHead className="w-1/6 hidden sm:table-cell">
							Brand
						</TableHead>
						<TableHead className="w-1/12">
							Price
						</TableHead>
						<TableHead className="w-1/6">
							Amount
						</TableHead>
						<TableHead className="w-1/6">
							Total
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products
						.filter(product => Object.keys(order)
							.includes(product.id.toString())
						)
						.map((product) => (
							<TableRow key={product.id} className="w-full *:p-1 overflow-hidden text-ellipsis text-xl sm:text-2xl text-center">
								<TableCell className="relative w-20 h-16">
									<Image alt={product.name} src={`/products/${product.images[0]}`} fill />
								</TableCell>
								<TableCell className="text-md sm:text-lg">
									{product.name}
								</TableCell>
								<TableCell className="hidden sm:table-cell">
									{product.brand.name}
								</TableCell>
								<TableCell>
									{order[product.id].price}
								</TableCell>
								<TableCell>
									{interactive
										?
										<AmmountSelector value={order[product.id].amount} onChange={(val: number) => setter(product.id, val)} className="" />
										:
										<>{order[product.id].amount}</>
									}
								</TableCell>
								<TableCell>
									{order[product.id].price * order[product.id].amount}
								</TableCell>
							</TableRow>
						))}
					<TableRow className="text-2xl capitalize text-center text-accent">
						<TableCell />
						<TableCell />
						<TableCell className="hidden sm:table-cell" />
						<TableCell />
						<TableCell>
							{totalAmount}
						</TableCell>
						<TableCell>
							{totalPrice}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	)
}

export default function Cart() {
	const items = useCartStore(state => state.items)
	const [loadingOrder, setLoadingOrder] = React.useState(false)
	const { handleResponse, error } = useToast()
	const _setter = useCartStore(state => state.setItemsAndUpdate)
	const resetCart = () => _setter({})
	const { value: products, loading } = useAction(
		() => getProductsByIdsAction(Object.keys(items).map(Number)),
		[])
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
		if (handleResponse(res))
			resetCart()
	}
	const order: React.ComponentProps<typeof CartTable>['order'] = {}
	for (const product of products) {
		order[product.id] = { price: calcPrice(product.price, product.discount), amount: items[product.id] }
	}
	return (
		<div className="sm:w-[60vw] sm:h-[70vh] flex flex-col">
			<Loading loading={loading}>
				<ScrollArea className="h-full w-full" type="always">
					<CartTable interactive products={products} order={order} />
					<ScrollBar />
				</ScrollArea>
				<Button
					className="right-0 w-fit text-2xl capitalize px-4 flex-grow-0 relative"
					disabled={loadingOrder || loading || Object.keys(order).length === 0}
					onClick={handleClick}
					type="submit"
				>
					Order
				</Button>
			</Loading>
		</div>
	)
}
