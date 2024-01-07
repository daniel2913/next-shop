"use server"
import { ProductModel } from "@/lib/DAL/Models"
import { populateProducts } from "@/helpers/getProducts"

export async function getProductsByIdsAction(query: string | string[] | RegExp) {
	if (!query || (Array.isArray(query) && query.length === 0)) return []
	const products = await ProductModel.find({ id: query })
	return populateProducts(products)
}
