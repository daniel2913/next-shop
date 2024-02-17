import {ProductModel } from "@/lib/Models"
import React from "react"
import BrandCard from "./BrandCard"
import { BrandCache } from "@/helpers/cachedGeters"
import {count} from "drizzle-orm"
import HorizontalScroll from "../ui/HorizontalScroll"

type Props = {
	className?:string
}

export default async function BrandList(props:Props) {
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
				<HorizontalScroll className={props.className}>
				{brands.map((brand) => (
					<BrandCard 
						className="h-30 w-40 p-2 rounded-md bg-cyan-200"
						key={`${brand.id}`}
						brand={brand}
						products={products[brand.id.toString()]||0}
					/>
				))}
				</HorizontalScroll>
		</>
	)
}
