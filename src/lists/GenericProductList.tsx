"use client"
import { useItemsController } from "@/hooks/useItemsController"
import type { PopulatedProduct } from "@/lib/Models/Product"
import React from "react"
import ProductCard from "../components/product/card"
import Loading from "../components/ui/Loading"
import { getProductsByIds } from "@/actions/product"
import { getProductsPageAction } from "@/actions/product"

export type Props = {
	products: PopulatedProduct[]
}

export function GenericProductList({ products: initProducts }: Props) {
	const {
		items: products,
		reloadOne,
		updateOne,
		loading,
	} = useItemsController({
		initItems: initProducts,
		getItems: getProductsByIds,
	})
	return (
		<Loading loading={loading}>
			{products.map((product) => (
				<ProductCard
					key={product.id}
					{...product}
					reload={reloadOne}
					update={updateOne}
				/>
			))}
		</Loading>
	)
}
