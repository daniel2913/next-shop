import TopDiscountProducts from "@comps/product/TopDiscounts"
import BrandList from "@comps/brand/BrandList"
import CategoryList from "@comps/category/CategoryList"
import TopRatingProducts from "@comps/product/TopRatingProducts"
import SavedProducts from "@comps/product/SavedProducts"
import { ReloadOnUserChange } from "@comps/navbar/auth/Auth"

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
