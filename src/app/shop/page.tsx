import ProductList from "@/components/Products"
import { getProducts } from "@/helpers/getProducts"
import { Session } from "next-auth"

export default async function Shop({
	searchParams,
}: {
	session: Session | null
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const initProducts = await getProducts(searchParams)
	return (
		<div className="">
			<ProductList initProducts={initProducts} />
		</div>
	)
}
