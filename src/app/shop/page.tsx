import NavBar from "@/components/NavBar"
import ProductList from "@/components/Products"
import ProductStoreProvider from "@/components/Products/productsStoreProvider"
import TopDiscountProducts from "@/components/Products/topDiscounts"
import { DiscountCache } from "@/helpers/cachedGeters"
import { getProducts } from "@/helpers/getProducts"
import { Suspense } from "react"


export default async function Shop({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	console.log("Generating props")
	const initProducts = await getProducts(new URLSearchParams(searchParams))

	return (
		<div className="">
		<ProductStoreProvider products={initProducts}>
			<NavBar/>
			<TopDiscountProducts/>
			<ProductList products={initProducts} />
		</ProductStoreProvider>
		</div>
	)
}
