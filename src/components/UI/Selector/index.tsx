"use client"

import React from "react"

type props = {
	options: string[]
	className?: string
	id: string
	label: string
	value: string
	setValue: (a: string) => void
}

export default function Selector({
	options,
	className,
	id,
	label,
	value,
	setValue,
}: props) {
	const [open, setOpen] = React.useState<boolean>(false)
	React.useEffect(() => {
		setValue(options[0])
	}, [])
	return (
		<div
			onBlur={() => setOpen(false)}
			className={`${className}`}
		>
			<label
				htmlFor={id}
				className=""
			>
				{label}
			</label>
			<input
				placeholder="Not Found..."
				className=""
				onFocus={() => setOpen((prev) => !prev)}
				type="text"
				value={value}
				name={id}
				id={id}
			/>
			<div
				aria-hidden={!open}
				className=""
			>
				<ul>
					{options.map((option) => (
						<li key={option}>
							<button
								onClick={(e) => {
									e.preventDefault()
									setValue(option)
									e.currentTarget.blur()
								}}
								className=""
							>
								{option}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
