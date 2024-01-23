"use client"

import React from "react"
import { Select, Option } from "@/components/material-tailwind"
type Props = {
	className?: string
	id: string
	label?: string
	value: string
	options?: string[]
	fetchAction?: () => Promise<string[]>
	setValue: (a: string) => void
} 

export default function Selector({
	className,
	id,
	label,
	value,
	setValue,
	...props
}: Props) {

	let options: string[] = ["Loading..."]
	if (props.options) {
		options = props.options
	}

	const [optionsState, setOptionsState] = React.useState(options||[value])
	const [pending, startTransition] = React.useTransition()
	React.useEffect(() => {
		async function fetchOptions() {
			setValue(value||optionsState[0])
			if (props.fetchAction) {
				startTransition(async () => {
					const res = await props.fetchAction()
					if (!res) setOptionsState(["Error!"])
					else setOptionsState(res)
					setValue(optionsState[0])
				})
			}
		}
		fetchOptions()
	}, [])
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
			value={value}
			disabled={pending}
			onChange={(e)=>setValue(e)}
			label={label}
			name={id}
		>
			{optionsState.map((option, idx) =>
				<Option value={option} key={idx}>{option}</Option>
			)}
		</Select>
		</>
	)
}
