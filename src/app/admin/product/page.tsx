import { getProductsByIdsAction } from "@/actions/product"
import ProductForm from "@/components/forms/ProductForm"

export default async function AddProductPage() {
	const test = (await getProductsByIdsAction('62'))[0]
	const refine = {
		...test,
		brand:test.brand.name,
		category:test.category.name
	}
	return (
		<ProductForm
			initValues={refine}
		/>
	)
}
