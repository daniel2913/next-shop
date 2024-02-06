"use client"
import useCartStore from "@/store/cartStore"
import AmmountSelector from "../AmmountSelector"
import { useSession } from "next-auth/react"
import React from "react"
import { Button } from "../button"
import {cn} from "@/lib/utils"

interface Props {
	className: string
	id: number
}

const BuyButton = React.memo(function BuyButton({ className, id }: Props) {
	const session = useSession()
	const amount = useCartStore((state) => state.items[id])
	const addItem = useCartStore((state) => state.addItem)
	if (session.data?.user?.role==="admin"){
		return null
	}
		return (
			<div className={cn(
			`border-2 rounded-lg`
			,className)}>
			{
				amount>0 
				? 
			<AmmountSelector
				id={id}
				confirmation
				className="w-full h-full"
			/>
				:
			<Button
				type="button"
				className={`
					w-full h-full 
					border-none py-2
					text-xl font-bold uppercase`}
				onClick={() => addItem(id)}
			>
				Buy
			</Button>
			}
			</div>
		)
	})
export default BuyButton
