import React from "react"
import NavBar from "@/components/NavBar"
import NavBarContainer from "@/components/NavBar/container"
import Search from "@/components/UI/Search"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"

interface LayoutProps {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: LayoutProps) {
	const brands = BrandCache.get()
	const categories = CategoryCache.get()
	return (
		<><header className="sm:min-h-14 transition-[height]">
			<NavBarContainer
				search={
			<Search
				className="mx-auto h-4/5"
				brandsPromise={brands}
				categoriesPromise={categories}
			/>
				}
			>
			<NavBar/>
			</NavBarContainer>
			</header>
			{children}
		</>
	)
}
