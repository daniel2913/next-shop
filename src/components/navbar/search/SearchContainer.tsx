"use client"

import useResponsive from "@/hooks/useResponsive"
import React from "react"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer"
import Glass from "@public/search.svg"
import useModal from "@/hooks/modals/useModal"
import NavButton from "../../ui/Navbutton"

type Props = {
	children: React.ReactNode
	className?: string
}

export default function SearchContainer({ children, className }: Props) {
	const mode = useResponsive()
	const modal = useModal()
	return mode === "desktop" ? (
		<div className={className}>{children}</div>
	) : (
		<NavButton
			className={className}
			onClick={() => modal.show(children)}
		>
			<Glass
				width="30px"
				height="30px"
				className="rounded-full opacity-80 *:fill-foreground *:stroke-foreground"
			/>
			Search
		</NavButton>
	)
}
