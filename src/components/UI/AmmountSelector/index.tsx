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
	value:number
	onChange:(val:number)=>void
	confirm?:boolean
}

export default function AmmountSelector({ className,value, onChange, confirm: confirmation}: Props) {
	const confirm = useConfirm("Are you sure you want to discard this item?")
	function clickHandler(newAmount: number) {
		if (newAmount <= 0) {
			if (confirmation)
			confirm().then((ans) => {
				return ans ? onChange(0) : false
			})
			else
				return onChange(0)
		} else onChange(newAmount)
	}
	return (
		<div
			className={`${className} flex justify-between font-semibold text-secondary-600`}
		>
			<button
				type="button"
				className="text-inherit flex justify-center items-center mr-auto flex-grow leading-4"
				onClick={() => clickHandler(value - 1)}
			>
				<Minus className="stroke-2 stroke-secondary" width="15px" height="15px"/>
			</button>
			<span className="text-inherit grow-0 text-center w-[3ch] overflow-clip text-3xl basis-8">{value}</span>
			<button
				type="button"
				className="text-inherit flex justify-center items-center ml-auto flex-grow leading-4 "
				onClick={() => clickHandler(value + 1)}
			>
				<Plus className="stroke-2 stroke-secondary" width="15px" height="15px"/>
			</button>
		</div>
	)
}
