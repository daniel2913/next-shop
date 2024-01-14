import {ProductModel} from "@/lib/DAL/Models"
import React from "react"
import CategoryCard from "./categoryCard"
import { CategoryCache } from "@/helpers/cachedGeters"
import {sql} from "drizzle-orm"
export default async function CategoryList() {
	const categories = await CategoryCache.get()
	const products = Object.fromEntries((
		(await ProductModel.raw(sql.raw(`
		SELECT products.category, COUNT(*) as products  FROM shop.products
		GROUP BY products.category;
	`)) as any as {category:number,products:number}[])
	).map(row=>[row.category,row.products])
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
