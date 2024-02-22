"use client"
import useResponsive from "@/hooks/useResponsive"
import React from "react"

type Props = {
	children: React.ReactNode
}

export default function NavBarContainer({ children }: Props) {
	const [visible, setVisible] = React.useState(false)
	React.useEffect(() => {
		setVisible(true)
	}, [])
	const mode = useResponsive()
	if (!visible) return null
	return mode === "desktop" ? (
		<header className="pointer-events-auto fixed left-0 right-0 top-0 z-50 mb-2 flex h-12 animate-slide-down items-center bg-secondary px-5 py-1 pr-[var(--removed-body-scroll-bar-size)] text-foreground">
			{children}
		</header>
	) : (
		<header className="pointer-events-auto  fixed bottom-0 left-0 right-0 z-[100] mt-2 flex h-12 animate-slide-up justify-between bg-secondary px-2">
			{children}
		</header>
	)
}
