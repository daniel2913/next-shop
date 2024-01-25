"use server"
import { ProductModel } from "@/lib/DAL/Models"
import { populateProducts } from "@/helpers/getProducts"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { parseFormData } from "@/lib/DAL/Models/common"
import { ilike, inArray } from "drizzle-orm"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { PgreModel } from "@/lib/DAL/Models/base"
import { modelGeneralAction } from "./common"

export async function getProductsByIdsAction(query: string | string[] | RegExp) {
	if (!query || (Array.isArray(query) && query.length === 0)) return []
	const products = await ProductModel.find({ id: query })
	return populateProducts(products)
}

type Params = {
	brand?: string[] | number[],
	category?: string[] | number[],
	skip?: number,
	page?: number,
	name?: string
}

export async function getProductsPageAction({
	brand,
	category,
	name,
	skip = 0,
	page = 10,
}: Params) {

	let query = ProductModel.model
		.select()
		.from(ProductModel.table)
		.offset(skip)
		.limit(page)
		.$dynamic()

	if (brand && brand.length>0) {
		let brandQuery:number[]
		if (typeof brand[0] === "string") {
			const brands = await BrandCache.get()
			brandQuery = brand
				.filter(brand => brands.find(_brand => _brand.name === brand))
				.map(brand => brands.find(_brand => _brand.name === brand)!.id)
		}
		else brandQuery = brand as number[]
		if (brandQuery.length>0)
		query = query.where(inArray(ProductModel.table.brand,brandQuery))
	}

	if (category && category.length>0) {
		let categoryQuery:number[]
		if (typeof category[0] === "string") {
			const categories = await CategoryCache.get()
			categoryQuery = category
				.filter(category => categories.find(_category => _category.name === category))
				.map(category => categories.find(_category => _category.name === category)!.id)
		}
		else categoryQuery = category as number[]
		if (categoryQuery.length > 0)
		query = query.where(inArray(ProductModel.table.category,categoryQuery))
	}

	if (name && name.length>0) {
		query.where(ilike(ProductModel.table.name,`%${name}%`))
	}
	return populateProducts(await query)

}

export async function createProductAction(form: FormData) {
	return modelGeneralAction(ProductModel,form)
}

export async function changeProductAction(id: number, form: FormData) {
	return modelGeneralAction(ProductModel,form,id)
}
