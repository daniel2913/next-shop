import NavBar from "@/components/NavBar"
import ProductList from "@/components/Products"
import ProductStoreProvider from "@/components/Products/productsStoreProvider"
import { getProducts } from "@/helpers/getProducts"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"

type Props = {
	initProducts:PopulatedProduct[]
}


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
			<NavBar />
			<ProductList products={initProducts} />
		</ProductStoreProvider>
		</div>
	)
}
