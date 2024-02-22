"use client"
import React from "react"

type ResponsiveProps = {
	children: React.ReactNode
}

export const ResponsiveContext = React.createContext({ mode: "desktop" })
export function ResponsiveProvider({ children }: ResponsiveProps) {
	const mode = React.useSyncExternalStore(
		(onChange) => {
			window.addEventListener("resize", onChange)
			return () => window.removeEventListener("resize", onChange)
		},
		() => (window.innerWidth > 768 ? "desktop" : "mobile"),
		() => "desktop"
	) as "desktop" | "mobile"
	return (
		<ResponsiveContext.Provider value={{ mode }}>
			{children}
		</ResponsiveContext.Provider>
	)
}
