"use client"
import Image from "next/image"
import Price from "@/components/product/Price"
import useCartStore from "@/store/cartStore"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"

type props = {
	product: PopulatedProduct
	className: string
}

export default function CartRow({ className, product }: props) {
	const {
		setAmmount: ammountSetter,
		discardItem: itemDiscarder,
	} = useCartStore((state) => state)
	const storeAmount = useCartStore(
		(state) => state.items[product.id]
	)
	const setAmmount = (amnt: number) =>
		ammountSetter(product.id, amnt)
	const discardItem = () => itemDiscarder(product.id)
	return (
		<div
			className={` ${className}
				border-1 border-tel-300 col-span-6 grid grid-cols-6 items-center
				justify-items-center rounded-md bg-cyan-300 p-2
			`}
		>
			<div className="relative aspect-square h-[1.2em]">
				<Image
					alt=""
					fill
					sizes="
					(max-width:640px) 10vw
					(max-width:1024px) 5vw
				"
					src={`/products/${product.images[0]}`}
				/>
			</div>
			<span className="w-[10ch] text-center text-accent1-400">
				{product.name}
			</span>
			<Price
				price={product.price}
				discount={product.discount}
				className=""
			/>
			<div className="flex w-full justify-around">
				<button
					className=""
					type="button"
					onClick={() => setAmmount(storeAmount - 1)}
				>
					-
				</button>
				<span className="w-[3ch] text-center">
					{storeAmount}
				</span>
				<button
					className=""
					type="button"
					onClick={() => setAmmount(storeAmount + 1)}
				>
					+
				</button>
			</div>
			<span>
				{(product.price -
					(product.price * product.discount.discount) / 100) *
					storeAmount}
			</span>
			<button
				className="text-accent1-600"
				type="button"
				onClick={discardItem}
			>
				X
			</button>
		</div>
	)
}
