"use client"
import useResponsive from "@/hooks/useResponsive"
import { Button } from "./Button"
import { cn } from "@/helpers/utils"
import React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>
const NavButton = React.forwardRef(function NavButton(
	props: Props,
	ref: React.ForwardedRef<HTMLButtonElement>
) {
	const mode = useResponsive()
	return (
		<Button
			{...props}
			ref={ref}
			className={cn(
				"relative flex h-full items-center justify-center bg-transparent p-0 text-foreground transition-colors hover:bg-transparent hover:drop-shadow-lg",
				mode === "desktop" ? "flex-row gap-2 " : "flex-col",
				props.className
			)}
		>
			{props.children}
		</Button>
	)
})

export default NavButton
