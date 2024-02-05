"use client"
import useResponsive from "@/hooks/useWidth"
import React from "react"
import Glass from "@public/search.svg"
import { Drawer, DrawerContent, DrawerTrigger } from "../UI/drawer"

type Props = {
	children: React.ReactNode
	search: React.ReactNode
}

export default function NavBarContainer({ children, search }: Props) {
	const [visible, setVisible] = React.useState(false)
	const mode = useResponsive()
	React.useEffect(() => setVisible(true), [])
	if (!visible) return null
	return (
		mode === "desktop"
			? <div
				className="
				fixed left-0 right-0 top-0 z-[100]
				flex h-12 items-center
				bg-secondary px-5 animate-slide-down
				py-1 "
			>
				<div className="order-2">
					{search}
				</div>
				{children}
			</div>
			:
			<div className="z-[100] fixed justify-between animate-slide-up left-0 right-0 bottom-0 h-12 flex justify-between bg-secondary px-2">
				<Drawer modal={false}>
					<DrawerTrigger className="flex basis-0 flex-auto flex-col items-center order-2">
						<Glass width="30px" height="30px" className="bg-tan opacity-80 rounded-full"/>
						search
					</DrawerTrigger>
					<DrawerContent className="w-full bg-secondary items-end">
						{search}
					</DrawerContent>
				</Drawer>
					{children}
			</div>
	)
}
