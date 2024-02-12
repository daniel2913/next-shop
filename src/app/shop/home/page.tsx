import TopDiscountProducts from "@/components/Products/topDiscounts"
import BrandList from "@/components/brand/Brands"
import CategoryList from "@/components/category/CategoryList"
import TopRatingProducts from "@/components/Products/topRatingProducts"
import SavedProducts from "@/components/Products/savedProducts"
import { ReloadOnUserChange } from "@/components/UI/Auth"

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
