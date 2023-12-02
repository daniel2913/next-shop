"use server"
import { ProductModel } from '@/lib/DAL/Models';
import {BrandCache, CategoryCache, DiscountCache} from '../helpers/cachedGeters'
import { populateProducts } from '@/components/Products';

export async function getProducts(query:string|string[]|RegExp) {
	
	if (!query || Array.isArray(query)&&query.length===0) return []
	const [products,brandList,categoryList,discountList] = await Promise.all([
		ProductModel.find({id:query}),
		BrandCache.get(),
		CategoryCache.get(),
		DiscountCache.get(),
	])

	return populateProducts(products)

}
