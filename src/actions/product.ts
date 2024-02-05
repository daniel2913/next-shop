"use server"
import { ProductModel } from "@/lib/DAL/Models"
import { populateProducts } from "@/helpers/getProducts"
import { ilike, inArray } from "drizzle-orm"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { ServerError, modelGeneralAction } from "./common"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"



export async function getAllProductsAction() {
	try{
	const session = await getServerSession(authOptions)
	if (session?.user?.role!=="admin") throw ServerError.notAllowed()
		const products = await ProductModel.find()
		return await populateProducts(products)
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function getProductsByIds(query:number|number[]){
		query = z.number().or(z.array(z.number())).parse(query)
		const products = await ProductModel.find({ id: query })
		return populateProducts(products)
}

export async function getProductsByIdsAction(query: number | number[]) {
	try{
		return await getProductsByIds(query)
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

type Params = {
	brand?: string[]
	category?: string[]
	skip?: number | string,
	page?: number | string,
	name?: string
}

const querySchema = z.object({
	brand: z.array(z.string()).optional().transform(ar=>ar&&ar?.length>0 ? ar : undefined),
	category: z.array(z.string()).optional().transform(ar=>ar&&ar?.length>0 ? ar : undefined),
	name: z.string().optional(),
	skip: z.coerce.number().default(0),
	page: z.coerce.number().default(10)
})


export async function getProductsPageAction(params: Params) {
	try{
	const { brand, category, name, skip, page, } =querySchema.parse(params)
	let query = ProductModel.model
		.select()
		.from(ProductModel.table)
		.offset(+skip)
		.limit(+page)
		.$dynamic()

	if (brand && brand.length > 0) {
		let brandQuery: number[]
		const brands = await BrandCache.get()
		brandQuery = brand
			.filter(brand => brands.find(_brand => _brand.name === brand))
			.map(brand => brands.find(_brand => _brand.name === brand)!.id)
		if (brandQuery.length > 0)
			query = query.where(inArray(ProductModel.table.brand, brandQuery))
	}

	if (category && category.length > 0) {
		let categoryQuery: number[]
		const categories = await CategoryCache.get()
		categoryQuery = category
			.filter(category => categories.find(_category => _category.name === category))
			.map(category => categories.find(_category => _category.name === category)!.id)
		if (categoryQuery.length > 0)
			query = query.where(inArray(ProductModel.table.category, categoryQuery))
	}

	if (name && name.length > 0) {
		query.where(ilike(ProductModel.table.name, `%${name}%`))
	}
	return populateProducts(await query)

	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
	

}

export async function createProductAction(form: FormData) {
	return modelGeneralAction(ProductModel, form)
}

export async function changeProductAction(id: number, form: FormData) {
	return modelGeneralAction(ProductModel, form, id)
}
