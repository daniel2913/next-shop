import React from "react"
import NavBar from "@/components/NavBar"
import NavBarContainer from "@/components/NavBar/container"
import Search from "@/components/UI/Search"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { CartControl } from "@/components/cart/Status"
import { ProductControl } from "@/components/UI/Auth"
import { ToggleGroup, ToggleGroupItem } from "@/components/UI/toggle-group"
import Image from "next/image"

type Props = {
	children: React.ReactNode
}

export default async function ShopLayout({ children }: Props) {
	const brands = await BrandCache.get()
	const categories = await CategoryCache.get()
	return (
		<>
			<NavBarContainer
				search={
					<Search
						className="mx-auto h-4/5"
						brandItems={
							brands.map(brand =>
								<ToggleGroupItem name="brand" value={brand.name} key={brand.name}>
									<Image
										alt={brand.name}
										src={`/brands/${brand.image}`}
										height={60}
										width={60}
									/>
								</ToggleGroupItem>
							)}

						categoryItems={
							categories.map(category =>
								<ToggleGroupItem name="category" value={category.name} key={category.name}>
									<Image
										alt={category.name}
										src={`/categories/${category.image}`}
										height={30}
										width={30}
									/>
								</ToggleGroupItem>
							)
						}
					/>
				}
			>
				<NavBar />
			</NavBarContainer>
			{children}
			<CartControl />
			<ProductControl />
		</>
	)
}
