"use client"
import React from "react"

type ContextMenuItemProps = {
	children: React.ReactNode
	icon?: React.ReactElement
	action: () => any
	className?: string
}
export default function ContextMenuItem({ children, icon, action, className}: ContextMenuItemProps) {
	return (
		<div
				className="flex justify-evenly gap-4"
				onClick={action}
		>
					{icon}
					{children}
		</div>
	)
}
