"use client"
import React from "react"
import useConfirm from "@/hooks/modals/useConfirm"
import useCartStore from "@/store/cartStore"
import { Product } from "@/lib/DAL/Models"
import { useSession } from "next-auth/react"

interface Props {
	className: string
	id: number
	amount:number
}

export default function AmmountSelector({ className, id,amount}: Props) {
	const confirm = useConfirm("Are you sure you want to discard this item?")
	const {data} = useSession()
	const itemDiscarder = useCartStore((state) => state.discardItem)
	const ammountSetter = useCartStore((state) => state.setAmmount)
	const discardItem = () => itemDiscarder(id,!data?.user)
	const setAmmount = (amnt: number) => ammountSetter(id, amnt, !data?.user)
	function clickHandler(newAmount: number) {
		if (newAmount <= 0) {
			confirm().then((ans) => {
				return ans ? discardItem() : false
			})
		} else setAmmount(newAmount)
	}
	return (
		<div
			className={`${className} min-w-[4ch] w-fit flex justify-between text-4xl text-center text-accent1-600 font-semibold`}
		>
			<button
				type="button"
				className="text-inherit"
				onClick={() => clickHandler(amount - 1)}
			>
				-
			</button>
			<span className="text-inherit">{amount}</span>
			<button
				type="button"
				className="text-inherit"
				onClick={() => clickHandler(amount + 1)}
			>
				+
			</button>
		</div>
	)
}
