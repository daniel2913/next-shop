import { BrandModel, CategoryModel, DiscountModel } from "@/lib/DAL/Models"

export function cache<T extends (...args: any) => any>(func: T) {
	let cache: ReturnType<T>
	function revalidate(...args: Parameters<T>) {
		cache = func(args)
	}
	function get(...args: Parameters<T>) {
		if (cache) {
			return cache
		}
		cache = func(args)
		return cache
	}
	return [get, revalidate]
}

export const [getAllBrands, revalidateBrands] = cache(() => BrandModel.find())
export const [getAllCategories, revalidateCategories] = cache(() =>
	CategoryModel.find(),
)
export const [getAllDiscounts,revalidateDiscounts] = cache(()=> DiscountModel.find())
