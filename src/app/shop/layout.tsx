import React from "react"
import Navbar from "@/components/navbar/Navbar"
import NavBarContainer from "@/components/navbar/NavbarContainer"
import CartControllerServer from "@/components/cart/CartServerWrapper"

type Props = {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: Props) {
	return (
		<div className="flex min-h-screen flex-col-reverse md:flex-col">
			<NavBarContainer>
				<Navbar />
			</NavBarContainer>
			{children}
			<CartControllerServer />
		</div>
	)
}
