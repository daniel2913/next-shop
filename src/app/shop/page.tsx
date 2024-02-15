import ProductList from "@/components/product/ProductList"
import { getProductsPageAction } from "@/actions/product"
import React from "react"


export default async function Shop({
	searchParams,
}: {
	searchParams: Record<string,string>
}) {
	const params = new URLSearchParams(searchParams)
	const brand = params.get("brand")?.split(",")
	const category = params.get("category")?.split(",")
	const name = params.get("name") || undefined
	const initProducts = await getProductsPageAction({brand,category,name})
	if ("error" in initProducts) return <div>Error!</div>

	return (
		<div className="">
			<ProductList products={initProducts}/>
		</div>
	)
}
