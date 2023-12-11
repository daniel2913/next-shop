import NavBar from "@comps/NavBar"
import Link from "next/link"
import { ReactElement } from "react"

interface LayoutProps {
	children: ReactElement[]
	modal: ReactElement
}

export default async function ShopLayout({ children }: LayoutProps) {
	return (
		<>
			<NavBar />
			{children}
		</>
	)
}
