"use client"
import React from "react"
import useConfirm from "@/hooks/modals/useConfirm"
import useCartStore from "@/store/cartStore"
import { Product } from "@/lib/DAL/Models"
import { useSession } from "next-auth/react"

interface Props {
	className: string
	id: Product["id"]
}

export default function AmmountSelector({ className, id }: Props) {
	const confirm = useConfirm("Are you sure you want to discard this item?")
	const { data } = useSession()
	const amount = useCartStore((state) => state.items[id] || 0)
	const itemDiscarder = useCartStore((state) => state.discardItem)
	const ammountSetter = useCartStore((state) => state.setAmmount)
	if (amount === null) return <div>Error!</div>
	const discardItem = () => itemDiscarder(id, !data?.user)
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
			className={`${className} flex w-fit min-w-[4ch] justify-between text-center text-4xl font-semibold text-accent1-600`}
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
