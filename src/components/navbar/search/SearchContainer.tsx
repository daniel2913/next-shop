"use client"

import React from "react"
import Glass from "@public/search.svg"
import useModal from "@/hooks/modals/useModal"
import NavButton from "../../ui/Navbutton"
import {cn} from "@/helpers/utils"

type Props = {
	children: React.ReactNode
	className?: string
}

export default function SearchContainer({ children, className }: Props) {
	const modal = useModal()
	return	<>
		<div className={cn(className,"hidden md:block")}>{children}</div>
		<NavButton
			className={cn(className,"md:hidden")}
			onClick={() => modal.show(children)}
		>
			<Glass
				width="30px"
				height="30px"
				className="rounded-full opacity-80 *:fill-foreground *:stroke-foreground"
			/>
			Search
		</NavButton>
	</>
}
