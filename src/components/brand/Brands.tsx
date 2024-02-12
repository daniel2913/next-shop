import {ProductModel } from "@/lib/DAL/Models"
import React from "react"
import BrandCard from "./BrandCard"
import { BrandCache } from "@/helpers/cachedGeters"
import {count} from "drizzle-orm"
import { ScrollArea, ScrollBar } from "../UI/scroll-area"
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
		<>
				<h2>Brands</h2>
				<ScrollArea className="px-2 w-full overflow-y-hidden h-fit">
				<div className="flex pb-2 overflow-y-hidden h-fit w-fit gap-4 flex-shrink-0">
				{brands.map((brand) => (
					<BrandCard 
						className="h-30 w-40 p-2 rounded-md bg-cyan-200"
						key={`${brand.id}`}
						brand={brand}
						products={products[brand.id.toString()]||0}
					/>
				))}
				</div>
			<ScrollBar orientation="horizontal"/>
			</ScrollArea>
		</>
	)
}
