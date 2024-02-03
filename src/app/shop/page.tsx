import ProductList from "@/components/Products"
import { getProductsPageAction } from "@/actions/product"
import React from "react"


export default async function Shop({
	searchParams,
}: {
	searchParams: Record<string,string>
}) {
	const params = new URLSearchParams(searchParams)
	const brand = params.getAll("brand") || undefined
	const category = params.getAll("category") || undefined
	const name = params.get("name") || undefined
	const initProducts = await getProductsPageAction({brand,category,name})
	//const initProducts = await getProducts(params)

	return (
		<div className="">
			<ProductList products={initProducts} />
		</div>
	)
}
		// <ProductStoreProvider products={initProducts}>
		// </ProductStoreProvider>
