"use client"
import React  from "react"
import { Accordion as BaseAccordion, AccordionHeader, AccordionBody } from "@/components/material-tailwind"
type AccordionProps = {
	children: React.ReactNode
	className?: string
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
			className={`${className}`}
		>
			<AccordionHeader
				onClick={() => setOpen(!open)}
			>
				{label}
			</AccordionHeader>
			<AccordionBody>
				{children}
			</AccordionBody>
		</BaseAccordion>
	)
}
