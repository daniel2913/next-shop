import React from "react"
import Navbar from "@/components/NavBar"
import NavBarContainer from "@/components/NavBar/container"
import Search from "@/components/UI/Search"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { CartControl } from "@/components/cart/Status"
import { ProductControl } from "@/components/UI/Auth"

type Props = {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: Props) {
	return (
			<div className="pb-12 sm:pt-12 sm:pb-0">
			<NavBarContainer>
				<Navbar />
			</NavBarContainer>
			{children}
			<CartControl />
			<ProductControl />
		</div>
	)
}
