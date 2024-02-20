import TopDiscountProducts from "@/components/product/TopDiscounts"
import BrandList from "@/components/brand/BrandList"
import CategoryList from "@/components/category/CategoryList"
import TopRatingProducts from "@/components/product/TopRatingProducts"
import SavedProducts from "@/components/product/SavedProducts"
import { ReloadOnUserChange } from "@/components/navbar/auth/Auth"
import Loading from "@/components/ui/Loading"
import Spinner from "@public/loading.svg"

function Fallback(){
	return(
		<div className="h-lgCardY w-full bg-transparent flex items-center justify-center">
			<Spinner width={40} height={40} className="animate-spin"/>
		</div>
	)
}

export default async function HomePage() {
	return (
		<div className="p-4 text-3xl font-bold capitalize text-secondary">
			<Loading fallback={<Fallback/>}>
				<SavedProducts num={10} className="p-6 bg-secondary rounded-lg mb-8" />
			</Loading>
			<Loading fallback={<Fallback/>}>
				<TopRatingProducts className="p-6 bg-secondary rounded-lg mb-8"/>
			</Loading>
			<Loading fallback={<Fallback/>}>
				<TopDiscountProducts className="p-6 bg-secondary rounded-lg mb-8"/>
			</Loading>
			<Loading fallback={<Fallback/>}>
				<BrandList className="p-6 bg-secondary rounded-lg mb-8"/>
			</Loading>
			<Loading fallback={<Fallback/>}>
				<CategoryList className="p-6 bg-secondary rounded-lg mb-8"/>
			</Loading>
				<ReloadOnUserChange />
		</div>
	)
}
