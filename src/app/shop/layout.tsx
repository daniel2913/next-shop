import React from "react"
import NavBar from "@/components/NavBar"

interface LayoutProps {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: LayoutProps) {
	return (
		<>
			<NavBar/>
			{children}
		</>
	)
}
