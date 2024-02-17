"use client"
import { getProductsByIds, getProductsByIdsAction } from "@/actions/product"
import useCartStore from "@/store/cartStore"
import React from "react"
import { PopulatedProduct } from "@/lib/Models/Product"
import { createOrderAction } from "@/actions/order"
import useToast from "@/hooks/modals/useToast"
import calcPrice from "@/helpers/discount"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import useAction from "@/hooks/useAction"
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea"
import AmmountSelector from "@/components/ui/AmmountSelector"
import Loading from "@/components/ui/Loading"
import useResponsive from "@/hooks/useResponsive"

type Props = {
	products?: PopulatedProduct[]
	order: Record<string, { amount: number, price: number }>
	interactive?: boolean
	className?: string
}
export function CartTable({ className, products, order, interactive }: Props) {
	if (products === undefined)
		products = useAction(() => getProductsByIds(Object.keys(order).map(Number)), []).value
	const totalAmount = Object.values(order).reduce((sum, next) => sum + (next.amount || 0), 0)
	const totalPrice = Object.values(order).reduce((total, next) => total + (next.price * next.amount || 0), 0)
	const setter = useCartStore(state => state.setAmmount)
	const mode = useResponsive()
	if (mode === "desktop")
		return (
			<Table className={`${className} table-auto w-fit`}>
				<TableHeader className="">
					<TableRow className=" *:p-1 *:text-center text-center text-xl md:text-2xl text-accent">
						<TableHead className="w-1/6">
							Image
						</TableHead>
						<TableHead className="w-1/5">
							Product
						</TableHead>
						<TableHead className="w-1/6 hidden lg:table-cell">
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
							&& order[product.id].amount > 0
						)
						.map((product) => (
							<TableRow 
								key={product.id} 
								className="w-full *:p-1 overflow-hidden text-ellipsis text-xl md:text-2xl text-center"
							>
								<TableCell className="relative w-20 h-16">
									<Image alt={product.name} src={`/products/${product.images[0]}`} fill />
								</TableCell>
								<TableCell className="text-md md:text-lg">
									<h3>{product.name}</h3>
								</TableCell>
								<TableCell className="hidden lg:table-cell">
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
				</TableBody>
				<TableFooter>
					<TableRow className="text-3xl font-bold capitalize text-center text-accent">
						<TableCell>
							Total:
						</TableCell>
						<TableCell />
						<TableCell className="hidden lg:table-cell" />
						<TableCell />
						<TableCell>
							{totalAmount}
						</TableCell>
						<TableCell>
							{totalPrice}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		)
	return (
		<div className="w-full">
			{products
				.filter(product => Object.keys(order)
					.includes(product.id.toString())
					&& order[product.id].amount > 0
				)
				.map((product) => (
					<div
						key={product.id}
						className="flex gap-4 text-2xl first:mt-0 mt-1 pb-1 border-b-black border-2"
					>
						<div className="basis-1/5 relative p-4">
							<Image className="size-full" alt={product.name} src={`/products/${product.images[0]}`} fill />
						</div>
						<div className="basis-4/5 text-black">
							<h3 className="font-semibold">{product.name}</h3>
							<div className="flex justify-start font-semibold text-xl text-black/80">
								{order[product.id].price}
							</div>
							<div className="flex justify-between">
									{interactive
										?
										<AmmountSelector value={order[product.id].amount} onChange={(val: number) => setter(product.id, val)} className="" />
										:
										<span className="block w-[6ch] text-center">{order[product.id].amount}</span>
									}
								<span className="text-2xl font-bold">
									{order[product.id].price * order[product.id].amount}
								</span>
							</div>
						</div>
					</div>
				))}
				<div className="flex text-black text-3xl font-bold text-center">
					<span className="block basis-1/4 w-full">
						Total:
					</span>
					<div className="basis-4/5 w-full flex justify-between">
					<span className="block w-[5ch]">
						{totalAmount}
					</span>
					<span>
						{totalPrice}
					</span>
					</div>
				</div>
		</div>
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
		<div className="md:w-[60vw] w-full h-full md:h-[70vh] flex justify-center overflow-y-scroll md:overflow-y-hidden items-center flex-col">
			<Loading loading={loading}>
				<div className="flex flex-col w-full h-full items-center p-4 bg-border rounded-md">
					<ScrollArea className="h-full w-full" type="hover">
						<CartTable interactive products={products} order={order} />
						<ScrollBar />
					</ScrollArea>
					<div className="flex justify-center w-full">
						<Button
							variant="outline"
							className="right-0 rounded-md text-accent bg-secondary w-fit text-2xl capitalize px-4 flex-grow-0 relative"
							disabled={loadingOrder || loading || Object.keys(order).length === 0}
							onClick={handleClick}
							type="submit"
						>
							Order
						</Button>
					</div>
				</div>
			</Loading>
		</div>
	)
}
