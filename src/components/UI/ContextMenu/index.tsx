import {Menu, MenuList, MenuHandler, MenuItem } from "@/components/material-tailwind"
import React from "react"

type ContextMenuProps = {
	children: React.ReactElement[]
	className?: string
	icon: React.ReactElement
}
export default function ContextMenu({ children, className, icon }: ContextMenuProps) {
	return (
		<Menu>
				<MenuHandler
					className={`${className || ""}`}
				>
					<button
						className="appearance-none"
					>
						{icon}
					</button>
				</MenuHandler>
				<MenuList>
						{children.map((child,idx)=><MenuItem key={idx}>{child}</MenuItem>)}
				</MenuList>
		</Menu>
	)
}

