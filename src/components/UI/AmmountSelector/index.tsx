"use client"
import React from "react"
import useConfirm from "@/hooks/modals/useConfirm"
import useCartStore from "@/store/cartStore"
import { Product } from "@/lib/DAL/Models"
import { useSession } from "next-auth/react"
import Plus from "@public/plus.svg"
import Minus from "@public/minus.svg"

interface Props {
	className: string
	id: Product["id"]
	confirmation?:boolean
}

export default function AmmountSelector({ className, id, confirmation}: Props) {
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
			if (confirmation)
			confirm().then((ans) => {
				return ans ? discardItem() : false
			})
			else
				discardItem()
		} else setAmmount(newAmount)
	}
	return (
		<div
			className={`${className} flex justify-between font-semibold text-secondary-600`}
		>
			<button
				type="button"
				className="text-inherit flex justify-center items-center mr-auto flex-grow leading-4"
				onClick={() => clickHandler(amount - 1)}
			>
				<Minus className="stroke-2 stroke-secondary" width="15px" height="15px"/>
			</button>
			<span className="text-inherit grow-0 text-center w-[3ch] overflow-clip text-3xl basis-8">{amount}</span>
			<button
				type="button"
				className="text-inherit flex justify-center items-center ml-auto flex-grow leading-4 "
				onClick={() => clickHandler(amount + 1)}
			>
				<Plus className="stroke-2 stroke-secondary" width="15px" height="15px"/>
			</button>
		</div>
	)
}
