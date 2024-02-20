"use client"
import useResponsive from "@/hooks/useResponsive"
import { Button } from "../ui/Button"
import { cn } from "@/lib/utils"
import React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>
const NavButton = React.forwardRef(function NavButton(props: Props, ref) {
	const mode = useResponsive()
	return (
		<Button
			{...props}
			ref={ref}
			className={cn(
				"h-full text-foreground transition-colors p-0 bg-transparent relative hover:bg-transparent hover:drop-shadow-lg flex justify-center items-center",
				mode === "desktop"
					? "flex-row gap-2 "
					: "flex-col",
				props.className
			)}
		>
			{props.children}
		</Button>
	)
})

export default NavButton