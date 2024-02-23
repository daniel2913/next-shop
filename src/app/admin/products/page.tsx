import { getAllProductsAction } from "@/actions/product"
import ProductsAdmin from "@/components/admin/products/ProductsAdmin"
import React from "react"

export default async function AdminProductsPage() {
	const productsPromise = getAllProductsAction()
	const products = await productsPromise
	if ("error" in products) throw products.error
	return (
		<ProductsAdmin
			className="w-full"
			products={products}
		/>
	)
}
