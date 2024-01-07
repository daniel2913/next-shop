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
			className={`${className} flex flex-col 
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
					flex w-full flex-col items-center justify-center
					after:h-9 after:aria-hidden:max-h-0 after:aria-hidden:h-0 after:max-h-50 after:transition-[height]
					aria-hidden:mh-0
					mb-0 aria-hidden:mb-[-9999rem] duration-300
					overflow-y-hidden
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
