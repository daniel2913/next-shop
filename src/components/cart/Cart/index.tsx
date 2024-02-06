"use client"
import { getProductsByIdsAction } from "@/actions/product"
import { useSession } from "next-auth/react"
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
import Loading from "@/components/UI/Loading"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/UI/scroll-area"
import useAction from "@/hooks/useAction"

type Props = {
	products: PopulatedProduct[]
}
export function CartTable({products}:Props){
	const [loading,setLoading] = React.useState(false)
	const items = useCartStore((state) => state.items)
	const {handleResponse,error} = useToast()
	const itemsSetter = useCartStore((state) => state.setItemsAndUpdate)
	const resetCart = () => itemsSetter({})

	async function handleClick() {
		if (Object.keys(items).length === 0) return false
		setLoading(true)
		const order: Record<number, { price: number; amount: number }> = {}
		for (const id in items) {
			const product = products.find((product) => product.id === +id)
			if (!product) {
				error("Some of the products are no longer available","Catalog changed")
				setLoading(false)
				return
			}
			const price = calcPrice(product.price,product.discount.discount)
			const amount = items[+id]
			order[id] = { price, amount }
		}
		if (Object.keys(order).length !== Object.keys(items).length){
			error("Internal Error","Internal Error")
			setLoading(false)
			return
		}
		const res = await createOrderAction(order)
		setLoading(false)
		if (handleResponse(res))
			resetCart()
	}

	const totalAmount = Object.values(items).reduce((sum, next) => sum + next, 0)
	const totalPrice = products.reduce((total, next) => total +
		calcPrice(next.price,next.discount.discount) * items[next.id]||0,0
	)
	if (Object.keys(items).length===0)
		return <div className="h-full w-full flex justify-center items-center"><h3 className="block">wow such empty</h3></div>
	return 	(		
		<>
			<Table>
				<TableHeader>
					<TableRow className=" text-center text-2xl text-accent">
						<TableCell>
							Image
						</TableCell>
						<TableCell>
							Product Name
						</TableCell>
						<TableCell className="hidden sm:table-cell">
							Brand
						</TableCell>
						<TableCell>
							Price
						</TableCell>
						<TableCell>
							Amount
						</TableCell>
						<TableCell>
							Total
						</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
			{products.filter(product=>Object.keys(items).includes(product.id.toString())).map((product) => (
				<TableRow key={product.id} className="w-full overflow-hidden text-ellipsis text-xl sm:text-2xl text-center">
					<TableCell className="relative w-20 h-16">
						<Image alt={product.name} src={`/products/${product.images[0]}`} fill/>
					</TableCell>
					<TableCell>
						{product.name}
					</TableCell>
					<TableCell className="hidden sm:table-cell">
						{product.brand.name}
					</TableCell>
					<TableCell>
						{calcPrice(product.price,product.discount.discount)}
					</TableCell>
					<TableCell>
						<AmmountSelector className="" id={product.id}/>
					</TableCell>
					<TableCell>
						{calcPrice(product.price,product.discount.discount)*items[product.id]}
					</TableCell>
				</TableRow>
			))}
				<TableRow className="text-2xl capitalize text-center text-accent">
						<TableCell>
							Total:
						</TableCell>
						<TableCell/>
						<TableCell className="hidden sm:table-cell"/>
						<TableCell/>
						<TableCell>
							{totalAmount}
						</TableCell>
						<TableCell>
							{totalPrice}
						</TableCell>
				</TableRow>
				</TableBody>
			</Table>
			<Button
				className="right-0 relative"
				disabled={loading}
				onClick={handleClick}
				type="submit"
			>
				Order
			</Button>
		</>
	)
}


export default function Cart() {
	const items = useCartStore.getState().items 
	const {value:products} = useAction(
	()=>getProductsByIdsAction(Object.keys(items).map(Number)),
	[])
	return (
		<div className="w-full h-[60vh]">
			<CartTable products={products}/>
		</div>
	)
}
