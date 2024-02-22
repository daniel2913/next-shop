"use client"
import React from "react"
import useConfirm from "@/hooks/modals/useConfirm"
import Plus from "@public/plus.svg"
import Minus from "@public/minus.svg"

interface Props {
	className: string
	value: number
	onChange: (val: number) => void
	confirm?: boolean
}

export default function AmmountSelector({
	className,
	value,
	onChange,
	confirm: confirmation,
}: Props) {
	const confirm = useConfirm("Are you sure you want to discard this item?")
	function clickHandler(newAmount: number) {
		if (newAmount <= 0) {
			if (confirmation)
				confirm().then((ans) => {
					return ans ? onChange(0) : false
				})
			else return onChange(0)
		} else onChange(newAmount)
	}
	return (
		<div
			className={`${className} text-secondary-600 flex justify-between font-semibold`}
		>
			<button
				type="button"
				className="mr-auto flex flex-grow items-center justify-center leading-4 text-inherit"
				onClick={() => clickHandler(value - 1)}
			>
				<Minus
					className="*:stroke-foreground *:stroke-2"
					width="15px"
					height="15px"
				/>
			</button>
			<span className="w-[3ch] grow-0 basis-8 overflow-clip text-center text-3xl font-bold text-foreground">
				{value}
			</span>
			<button
				type="button"
				className="ml-auto flex flex-grow items-center justify-center leading-4 text-inherit "
				onClick={() => clickHandler(value + 1)}
			>
				<Plus
					className="*:stroke-foreground *:stroke-2"
					width="15px"
					height="15px"
				/>
			</button>
		</div>
	)
}
