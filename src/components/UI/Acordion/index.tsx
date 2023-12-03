"use client"
import React, { ReactElement } from "react"


type AccordionProps = {
	children: ReactElement[]
	className: string
	label: string
}

export default function Accordion({ className, children, label }: AccordionProps) {
	const [open, setOpen] = React.useState(false)
	return (
		<div
			aria-hidden={!open}
			className={`${className} transition-transform duration-300 flex flex-col peer peer-aria-hidden:-translate-y-3/4
						`}>
			<button
				className="w-full border-teal-600"
				type="button"
				onClick={() => setOpen(prev => !prev)}>{label}</button>
			<div
				aria-hidden={!open}
				className={`
					flex flex-col w-full justify-center items-center origin-top scale-y-100
					aria-hidden:scale-y-0 transition-transform duration-300
					`}
			>
				{children.map((child, idx) =>
					<div
						key={idx}
						tabIndex={-100}
						className="bg-cyan-400 w-full "
					>
						{child}
					</div>
				)}
			</div>
		</div>

	)

}
