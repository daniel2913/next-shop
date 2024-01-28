"use client"

import React from "react"
import { Select, Option } from "@/components/material-tailwind"

type Props = {
	className?: string
	id: string
	label: string
	value: string
	onChange: (a: string) => void
	children: React.ReactNode
}

export default function Selector({
	className,
	id,
	label,
	value,
	onChange,
	children
}: Props) {
	
	return (
		<>
		<input
			readOnly
			value={value}
			className="hidden"
			name={id}
			id={id}
		/>
		<Select
			onChange={(e)=>onChange(e)}
			label={label}
			name={id}
		>
				{children}
		</Select>
		</>
	)
}
