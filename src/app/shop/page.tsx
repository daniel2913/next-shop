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
	const initProducts = await getProductsPageAction({brand,category,name, page:10})
	if ("error" in initProducts) return <div>Error!</div>

	return (
		<main
			className="
					h-full p-5 bg-background
					grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]
					gap-y-4
					items-center justify-items-center
				"
		>
			<ProductList products={initProducts}/>
		</main>
	)
}
