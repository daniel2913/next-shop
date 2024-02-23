"use client"
import { createOrderAction } from "@/actions/order"
import { CartTable } from "@/components/modals/cart/CartTable"
import { Button } from "@/components/ui/Button"
import calcPrice from "@/helpers/misc"
import useToast from "@/hooks/modals/useToast"
import { useAuthController} from "@/hooks/useAuthController"
import { PopulatedProduct } from "@/lib/Models/Product"
import useCartStore from "@/store/cartStore"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	products:PopulatedProduct[]
	initCart:Record<string,number>
}

export default function Cart(props:Props) {
	const items = useCartStore(state => state.items) 
	const [loadingOrder, setLoadingOrder] = React.useState(false)
	const { handleResponse, error } = useToast()
	const _setter = useCartStore((state) => state.setItemsAndUpdate)
	const resetCart = () => _setter({})
	async function handleClick() {
		if (Object.keys(items).length === 0) return false
		setLoadingOrder(true)
		const order: Record<number, { price: number; amount: number }> = {}
		for (const id in items) {
			const product = props.products.find((product) => product.id === +id)
			if (!product) {
				error("Some of the products are no longer available", "Catalog changed")
				setLoadingOrder(false)
				return
			}
			const price = calcPrice(product.price, product.discount)
			const amount = items[+id]
			if (!amount) continue
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
	const order: Record<string,{price:number,amount:number}> = {}
	for (const product of props.products) {
		if (!items[product.id]) continue
		order[product.id] = {
			price: calcPrice(product.price, product.discount),
			amount: items[product.id],
		}
	}
	const router = useRouter()
	useAuthController(router.refresh,{onUnAuth:()=>router.push("/shop/home")})

	if (Object.keys(items).length===0){
		return(
			<div className="h-full w-full flex justify-center items-center">
				<h1 className="text-4xl font-bold">It's empty now :(</h1>
			</div>
		)
	}
	return (
		<main className="p-4">
			<div className="bg-secondary rounded-md p-2">
			<CartTable interactive className="rounded-md" products={props.products} order={order} />
			<div className="flex gap-4 justify-end px-8">
			<Button
				className="px-4  text-3xl font-bold"
				onClick={()=>useCartStore.setState({items:{}})}
				type="submit"
			>
				Clear
			</Button>
			<Button
				className="px-4  text-3xl font-bold"
				disabled={
					loadingOrder || Object.keys(order).length === 0
				}
				onClick={handleClick}
				type="submit"
			>
				Order
			</Button>
			</div>
			</div>
		</main>
	)
}
