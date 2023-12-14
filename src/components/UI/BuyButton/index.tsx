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
	const amount = useCartStore((state) => state.items[id])
	const addItem = useCartStore((state) => state.addItem)
	if (session.data?.user?.role==="admin"){
		return null
	}
	if (amount) {
		return (
			<AmmountSelector
				className={`${className}`}
				id={id}
			/>
		)
	} else {
		return (
			<button
				type="button"
				className={`
					${className} w-16 min-w-fit 
					rounded-md border-2 border-accent1-200 py-2
					text-xl font-bold uppercase`}
				onClick={() => addItem(id)}
			>
				Buy
			</button>
		)
	}
}
