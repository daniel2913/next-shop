import React from "react"
import Navbar from "@/components/navbar/Navbar"
import NavBarContainer from "@/components/navbar/NavbarContainer"
import { CartControler } from "@/components/cart/CartControler"

type Props = {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: Props) {
	return (
		<div className="pb-12 md:pb-0 md:pt-12">
			<NavBarContainer>
				<Navbar />
			</NavBarContainer>
			{children}
			<CartControler />
		</div>
	)
}
