"use client"
import React, { ReactElement } from "react"

type AccordionProps = {
	children: ReactElement[]
	className: string
	label: string
}

export default function Accordion({
	className,
	children,
	label,
}: AccordionProps) {
	const [open, setOpen] = React.useState(false)
	return (
		<div
			aria-hidden={!open}
			className={`${className} peer flex flex-col transition-transform duration-300 peer-aria-hidden:-translate-y-3/4
						`}
		>
			<button
				className="w-full border-teal-600"
				type="button"
				onClick={() => setOpen((prev) => !prev)}
			>
				{label}
			</button>
			<div
				aria-hidden={!open}
				className={`
					flex w-full origin-top scale-y-100 flex-col items-center justify-center
					transition-transform duration-300 aria-hidden:scale-y-0
					`}
			>
				{children.map((child, idx) => (
					<div
						key={idx}
						tabIndex={-100}
						className="w-full bg-cyan-400 "
					>
						{child}
					</div>
				))}
			</div>
		</div>
	)
}
