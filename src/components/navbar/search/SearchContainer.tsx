"use client"

import React from "react"
import Glass from "@public/search.svg"
import NavButton from "../../ui/Navbutton"
import { useModalStore } from "@/store/modalStore"

type Props = {
	children: React.ReactNode
	className?: string
}

export default function SearchContainer({ children, className }: Props) {
	const show = useModalStore((s) => s.show)
	return (
		<>
			<div className={`${className} hidden md:block`}>{children}</div>
			<NavButton
				className={`${className} md:hidden`}
				onClick={() => show(children)}
			>
				<Glass
					width="30px"
					height="30px"
					className="rounded-full opacity-80 *:fill-foreground *:stroke-foreground"
				/>
				Search
			</NavButton>
		</>
	)
}
