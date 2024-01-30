import {ProductModel} from "@/lib/DAL/Models"
import React from "react"
import CategoryCard from "./CategoryCard"
import { CategoryCache } from "@/helpers/cachedGeters"
import {count} from "drizzle-orm"
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
		<div className="bg-green-100">
			<div
				className="
					h-full p-5
					grid sm:grid-cols-2  gap-y-8
					md:grid-cols-3 lg:grid-cols-4
					items-center justify-items-center
				"
			>
				{categories.map((category) => (
					<CategoryCard
						className="h-30 w-40 p-2 rounded-md bg-cyan-200"
						key={`${category.id}`}
						category={category}
						products={products[category.id.toString()]||0}
					/>
				))}
			</div>
		</div>
	)
}
