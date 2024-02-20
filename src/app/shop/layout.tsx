import React from "react"
import Navbar from "@/components/navbar/Navbar"
import NavBarContainer from "@/components/navbar/NavbarContainer"
import { CartControl } from "@/components/cart/Status"

type Props = {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: Props) {
	return (
			<div className="pb-12 md:pt-12 md:pb-0">
			<NavBarContainer>
				<Navbar />
			</NavBarContainer>
			{children}
			<CartControl />
		</div>
	)
}
