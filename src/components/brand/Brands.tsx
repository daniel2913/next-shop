import {ProductModel } from "@/lib/DAL/Models"
import React from "react"
import BrandCard from "./BrandCard"
import { BrandCache } from "@/helpers/cachedGeters"
import {count} from "drizzle-orm"
export default async function BrandList() {
	const brands = await BrandCache.get()
	const stats = await ProductModel.model
			.select({
				brand:ProductModel.table.brand,
				products:count()
			})
			.from(ProductModel.table)
			.groupBy(ProductModel.table.brand)

	const products = Object.fromEntries(
		stats.map(row=>[row.brand,row.products])
	)
	return (
		<div className="bg-green-100">
			<div
				className="
					h-full p-5
					grid sm:grid-cols-2  gap-y-8
					md:grid-cols-3 lg:grid-cols-4
					items-center justify-items-center
				"
			>
				{brands.map((brand) => (
					<BrandCard 
						className="h-30 w-40 p-2 rounded-md bg-cyan-200"
						key={`${brand.id}`}
						brand={brand}
						products={products[brand.id.toString()]||0}
					/>
				))}
			</div>
		</div>
	)
}
