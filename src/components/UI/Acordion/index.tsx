"use client"
import React, { ReactElement } from "react"
import { Accordion as BaseAccordion, AccordionHeader, AccordionBody } from "@/components/material-tailwind"
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
		<BaseAccordion
			open={open}
			className={`${className} flex flex-col`}
		>
			<AccordionHeader
				onClick={() => setOpen(!open)}
			>
				{label}
			</AccordionHeader>
			<AccordionBody>
			<div
				aria-hidden={!open}
				className={`
					flex w-full flex-col items-center justify-center
					`}
			>
				{children.map((child, idx) => (
					<div
						key={idx}
						tabIndex={-100}
						className="w-full bg-cyan-400 p-2"
					>
						{child}
					</div>
				))}
			</div>
			</AccordionBody>
		</BaseAccordion>
	)
}
