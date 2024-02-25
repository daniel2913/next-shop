import { ProductModel } from "@/lib/Models"
import React from "react"
import CategoryCard from "../../components/categories/CategoryCard"
import { CategoryCache } from "@/helpers/cache"
import { count } from "drizzle-orm"
import HorizontalScrollList from "../../components/ui/HorizontalScrollList"

type Props = {
	className?: string
}

export default async function CategoryList(props: Props) {
	const categories = await CategoryCache.get()
	const stats = await ProductModel.model
		.select({
			category: ProductModel.table.category,
			products: count(),
		})
		.from(ProductModel.table)
		.groupBy(ProductModel.table.category)
	const products = Object.fromEntries(
		stats.map((row) => [row.category, row.products])
	)
	return (
		<>
			<h2>Categories</h2>
			<HorizontalScrollList className={props.className}>
				{categories.map((category) => (
					<CategoryCard
						key={`${category.id}`}
						category={category}
						products={products[category.id.toString()] || 0}
					/>
				))}
			</HorizontalScrollList>
		</>
	)
}
