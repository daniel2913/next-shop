import React from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../dropdown-menu"

type ContextMenuProps = {
	children: React.ReactElement[]
	className?: string
	icon: React.ReactElement
}
export default function ContextMenu({ children, className, icon }: ContextMenuProps) {
	return (
		<DropdownMenu>
				<DropdownMenuTrigger
					className={`${className || ""}`}
				>
					<button
						className="appearance-none"
					>
						{icon}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
						{children.map((child,idx)=><DropdownMenuItem key={idx}>{child}</DropdownMenuItem>)}
				</DropdownMenuContent>
		</DropdownMenu>
	)
}

