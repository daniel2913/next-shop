import { ProductModel } from "@/lib/Models"
import React from "react"
import BrandCard from "../../components/brands/BrandCard"
import { BrandCache } from "@/helpers/cache"
import { count } from "drizzle-orm"
import HorizontalScrollList from "../../components/ui/HorizontalScrollList"

type Props = {
	className?: string
}

export default async function BrandList(props: Props) {
	const brands = await BrandCache.get()
	const stats = await ProductModel.model
		.select({
			brand: ProductModel.table.brand,
			products: count(),
		})
		.from(ProductModel.table)
		.groupBy(ProductModel.table.brand)

	const products = Object.fromEntries(
		stats.map((row) => [row.brand, row.products])
	)
	return (
		<>
			<h2>Brands</h2>
			<HorizontalScrollList className={props.className}>
				{brands.map((brand) => (
					<BrandCard
						key={`${brand.id}`}
						brand={brand}
						products={products[brand.id.toString()] || 0}
					/>
				))}
			</HorizontalScrollList>
		</>
	)
}
