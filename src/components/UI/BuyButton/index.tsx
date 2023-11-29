"use client"
import useCartStore from "@/store/cartStore"
import AmmountSelector from "../AmmountSelector"
import { useSession } from "next-auth/react"

interface Props {
	className: string
	id: number
}

export default function BuyButton({ className, id }: Props) {
	const session = useSession()
	const cachedItem = useCartStore((state) =>
		state.items.find((cacheItem) => cacheItem.productId === id),
	)
	const addItem = useCartStore((state) => state.addItem)
	if (cachedItem) {
		return <AmmountSelector className={`${className}`} {...cachedItem} />
	} else {
		return (
			<button
				type="button"
				className={`
					${className} w-16 min-w-fit 
					border-2 uppercase border-accent1-200 py-2
					rounded-md font-bold text-xl`}
				onClick={() => addItem(id)}
			>
				Buy
			</button>
		)
	}
}
