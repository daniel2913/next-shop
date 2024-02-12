import {ProductModel} from "@/lib/DAL/Models"
import React from "react"
import CategoryCard from "./CategoryCard"
import { CategoryCache } from "@/helpers/cachedGeters"
import {count} from "drizzle-orm"
import { ScrollArea, ScrollBar } from "../UI/scroll-area"
export default async function CategoryList() {
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
				<ScrollArea className="px-2 w-full overflow-y-hidden h-fit">
				<div className="flex pb-2 overflow-y-hidden h-fit w-fit gap-4 flex-shrink-0">
				{categories.map((category) => (
					<CategoryCard
						className="h-30 w-40 p-2 rounded-md bg-cyan-200"
						key={`${category.id}`}
						category={category}
						products={products[category.id.toString()]||0}
					/>
				))}
					</div>
			<ScrollBar orientation="horizontal"/>
		</ScrollArea>
		</>
	)
}
