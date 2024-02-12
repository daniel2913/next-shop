"use client"
import useResponsive from "@/hooks/useWidth"
import React from "react"

type Props = {
	children: React.ReactNode
}



export default function NavBarContainer({ children}: Props) {
	const [visible, setVisible] = React.useState(false)
	React.useEffect(() => setVisible(true), [])
	const mode = useResponsive()
	if (!visible) return null
	return (
		mode === "desktop"
			? <header
				className="
				pr-[var(--removed-body-scroll-bar-size)]
				fixed left-0 right-0 top-0 z-[100]
				flex items-center h-12 mb-2
				bg-secondary px-5 animate-slide-down
				py-1 pointer-events-auto"
			>
				{children}
			</header>
			:
			<header  className="z-[100] pointer-events-auto h-12 mt-2 fixed justify-between animate-slide-up left-0 right-0 bottom-0 flex justify-between bg-secondary px-2">
					{children}
			</header>
	)
}
