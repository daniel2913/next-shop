import ProductForm from "@/components/forms/ProductForm"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"

export default async function AddProductPage() {
	const [brandList, categoryList] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
	])
	return (
		<ProductForm
			brandList={brandList}
			categoryList={categoryList}
		/>
	)
}
