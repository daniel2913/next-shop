"use client"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import React from "react"
import {cn} from "@/lib/utils"
import AmmountSelector from "@/components/ui/AmmountSelector"
import { Button } from "@/components/ui/Button"

interface Props {
	className: string
	confirm?:boolean
	id: number
}

const BuyButton = React.memo(function BuyButton({ className,confirm, id }: Props) {
	const session = useSession()
	const amount = useCartStore((state) => state.items[id])
	const addItem = useCartStore((state) => state.addItem)
	if (session.data?.user?.role==="admin"){
		return null
	}
		return (
				amount>0 
				? 
			<AmmountSelector
				value={amount}
				onChange={(val:number)=>useCartStore.getState().setAmmount(id,val,!session.data?.user)}
				confirm={confirm}
				className={cn(
					className, 
					`border-2 border-card-foreground rounded-lg`
				)}
			/>
				:
			<Button
				type="button"
				className={cn(
					className,
					`border-2 border-card-foreground rounded-lg 
					border-none py-2
					text-xl font-bold uppercase`
				)}
				onClick={() => addItem(id)}
			>
				Buy
			</Button>
		)
	})
export default BuyButton
