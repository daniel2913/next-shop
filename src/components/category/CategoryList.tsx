import {ProductModel} from "@/lib/Models"
import React from "react"
import CategoryCard from "./CategoryCard"
import { CategoryCache } from "@/helpers/cachedGeters"
import {count} from "drizzle-orm"
import { ScrollArea, ScrollBar } from "../ui/ScrollArea"
import HorizontalScroll from "../ui/HorizontalScroll"

type Props = {
	className?: string
}

export default async function CategoryList(props:Props) {
	const categories = await CategoryCache.get()
	const stats = await ProductModel.model
			.select({
				category:ProductModel.table.category,
				products:count()
			})
			.from(ProductModel.table)
			.groupBy(ProductModel.table.category)
	const products = Object.fromEntries(
		stats.map(row=>[row.category,row.products])
	)
	return (
		<>
				<h2>Categories</h2>
				<HorizontalScroll className={props.className}>
				{categories.map((category) => (
					<CategoryCard
						className="h-30 w-40 p-2 rounded-md bg-cyan-200"
						key={`${category.id}`}
						category={category}
						products={products[category.id.toString()]||0}
					/>
				))}
				</HorizontalScroll>
		</>
	)
}
