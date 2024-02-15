import TopDiscountProducts from "@/components/product/TopDiscounts"
import BrandList from "@/components/brand/BrandList"
import CategoryList from "@/components/category/CategoryList"
import TopRatingProducts from "@/components/product/TopRatingProducts"
import SavedProducts from "@/components/product/SavedProducts"
import { ReloadOnUserChange } from "@/components/navbar/auth/Auth"

export default async function HomePage() {
	return (
		<div className="p-4 text-3xl font-bold capitalize text-secondary">
			<SavedProducts />
			<TopRatingProducts />
			<TopDiscountProducts />
			<BrandList />
			<CategoryList />
			<ReloadOnUserChange/>
		</div>
)
}
