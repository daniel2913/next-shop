"use client"
import useCartStore from "@/store/cartStore"
import AmmountSelector from "../AmmountSelector"
import { useSession } from "next-auth/react"

interface Props {
	className: string
	id: number
}

export default function BuyButton({ className, id }: Props) {
	const amount = useCartStore((state) => state.items[id])
	const addItem = useCartStore((state) => state.addItem)
	if (amount) {
		return <AmmountSelector className={`${className}`} amount={amount} id={id} />
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
