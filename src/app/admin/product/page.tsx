import ProductForm from "@/hooks/modals/forms/useProductForm"
import { getAllBrands, getAllCategories } from "@/helpers/cachedGeters"

export default async function AddProductPage() {
	const [brandList, categoryList] = await Promise.all([
		getAllBrands(),
		getAllCategories(),
	])
	return <ProductForm brandList={brandList} categoryList={categoryList} />
}
