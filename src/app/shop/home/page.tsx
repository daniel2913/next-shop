import TopDiscountProducts from "@/lists/home/TopDiscounts"
import BrandList from "@/lists/home/BrandList"
import CategoryList from "@/lists/home/CategoryList"
import TopRatingProducts from "@/lists/home/TopRatingProducts"
import SavedProducts from "@/lists/home/Saved"
import { ReloadOnUserChange } from "@/components/navbar/auth/Auth"
import Loading from "@/components/ui/Loading"
import Spinner from "@public/loading.svg"

function Fallback() {
	return (
		<div className="flex h-lgCardY w-full items-center justify-center bg-transparent">
			<Spinner
				width={40}
				height={40}
				className="animate-spin"
			/>
		</div>
	)
}

export default async function HomePage() {
	return (
		<main className="p-4 text-3xl font-bold capitalize text-secondary">
			<Loading fallback={<Fallback />}>
				<SavedProducts
					num={10}
					className="mb-8 rounded-lg bg-secondary p-6"
				/>
			</Loading>
			<Loading fallback={<Fallback />}>
				<TopRatingProducts className="mb-8 rounded-lg bg-secondary p-6" />
			</Loading>
			<Loading fallback={<Fallback />}>
				<TopDiscountProducts className="mb-8 rounded-lg bg-secondary p-6" />
			</Loading>
			<Loading fallback={<Fallback />}>
				<BrandList className="mb-8 rounded-lg bg-secondary p-6" />
			</Loading>
			<Loading fallback={<Fallback />}>
				<CategoryList className="mb-8 rounded-lg bg-secondary p-6" />
			</Loading>
			<ReloadOnUserChange />
		</main>
	)
}
