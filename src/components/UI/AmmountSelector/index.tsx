"use client"
import React from "react"
import useConfirm from "@/hooks/modals/useConfirm"
import useCartStore from "@/store/cartStore"
import { Product } from "@/lib/DAL/Models"

interface Props {
	className: string
	productId: Product["id"]
}

export default function AmmountSelector({ className, productId }: Props) {
	const confirm = useConfirm("Are you sure you want to discard this item?")
	const amount = useCartStore(
		(state) => state.items.find((state) => state.productId === productId)?.amount,
	)
	const itemDiscarder = useCartStore((state) => state.discardItem)
	const ammountSetter = useCartStore((state) => state.setAmmount)
	if (amount === null) return <div>Error!</div>
	const discardItem = () => itemDiscarder(productId)
	const setAmmount = (amnt: number) => ammountSetter(productId, amnt)
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
