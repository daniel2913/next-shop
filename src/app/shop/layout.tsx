import NavBar from "@comps/NavBar"
import Link from "next/link"
import { ReactElement } from "react"

interface LayoutProps {
	children: ReactElement[]
	modal: ReactElement
}

export default async function ShopLayout({
	children,
	modal,
}: LayoutProps) {
	console.log(modal)
	return (
		<>
			<NavBar />
			<Link href={"/shop/@modal/admin/orders"}>
				LINK TO ORDERS
			</Link>
			{children}
		</>
	)
}
