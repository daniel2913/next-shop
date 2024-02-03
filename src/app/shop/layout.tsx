import React from "react"
import NavBar from "@/components/NavBar"

interface LayoutProps {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: LayoutProps) {
	return (
		<>
			<NavBar/>
			<React.Suspense fallback=<div className="w-full h-full flex justify-center items-center">Loading...</div>>
			{children}
			</React.Suspense>
		</>
	)
}
