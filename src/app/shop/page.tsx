import NavBar from "@/components/NavBar"
import ProductList from "@/components/Products"
import ProductStoreProvider from "@/components/Products/productsStoreProvider"
import TopDiscountProducts from "@/components/Products/topDiscounts"
import { getProductsPageAction } from "@/actions/product"
import { getProducts } from "@/helpers/getProducts"


export default async function Shop({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const params = new URLSearchParams(searchParams)
	const initProducts = await getProducts(params)
	// PageAction({
	// 	brand:params.getAll("brand")||undefined,
	// 	category:params.getAll("category")||undefined
	// })

	return (
		<div className="">
		<ProductStoreProvider products={initProducts}>
			<NavBar/>
			<ProductList products={initProducts} />
		</ProductStoreProvider>
		</div>
	)
}
