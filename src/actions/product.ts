"use server"
import { ProductModel } from "@/lib/Models"
import { populateProducts } from "@/helpers/populateProducts"
import { inArray } from "drizzle-orm"
import { BrandCache, CategoryCache } from "@/helpers/cache"
import { ServerError, auth, modelGeneralAction } from "./common"
import { z } from "zod"
import { toArray } from "@/helpers/misc"

export async function getAllProductsAction() {
	try {
		await auth("admin")
		const products = await ProductModel.model.select().from(ProductModel.table)
		return await populateProducts(products)
	} catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function getProductsByIds(inp: number | number[]) {
	const query = z.number().or(z.array(z.number())).parse(inp)
	if (Array.isArray(query) && query.length === 0) return []
	const products = await ProductModel.find({ id: query })
	return populateProducts(products)
}

export async function getProductsByIdsAction(query: number | number[]) {
	try {
		return await getProductsByIds(query)
	} catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

type Params = {
	brand?: string[]
	category?: string[]
	skip?: number | string
	page?: number | string
	name?: string
}

const querySchema = z.object({
	brand: z
		.array(z.string())
		.optional()
		.transform((ar) => (ar && ar?.length > 0 ? ar : undefined)),
	category: z
		.array(z.string())
		.optional()
		.transform((ar) => (ar && ar?.length > 0 ? ar : undefined)),
	name: z.string().optional(),
	skip: z.coerce.number().default(0),
	page: z.coerce.number().default(20),
})

export async function getProductsPageAction(params: Params) {
	try {
		const { brand, category, name, skip, page } = querySchema.parse(params)
		let brandIds: number[] | undefined = undefined
		if (brand && brand.length > 0) {
			const brands = await BrandCache.get()
			brandIds = brand
				.filter((brand) => brands.find((_brand) => _brand.name === brand))
				.map((brand) => brands.find((_brand) => _brand.name === brand)!.id)
		}
		let categoryIds: number[] | undefined = undefined
		if (category && category.length > 0) {
			const categories = await CategoryCache.get()
			categoryIds = category
				.filter((category) =>
					categories.find((_category) => _category.name === category)
				)
				.map(
					(category) =>
						categories.find((_category) => _category.name === category)!.id
				)
		}

		const products = await ProductModel.find(
			{
				name: (name && `%${name}%`) || undefined,
				brand: brandIds,
				category: categoryIds,
			},
			page,
			skip
		)
		return populateProducts(products)
	} catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function deleteProductsAction(inp: number | number[]) {
	try {
		const ids = toArray(inp)
		if (!ids.length) throw ServerError.invalid()
		await auth("admin")
		const res = await ProductModel.model
			.delete(ProductModel.table)
			.where(inArray(ProductModel.table.id, ids))
			.returning({ id: ProductModel.table.id })
		return res.length
	} catch (error) {
		return ServerError.fromError(error).emmit()
	}
}
export async function createProductAction(form: FormData) {
	return modelGeneralAction(ProductModel, form)
}

export async function changeProductAction(id: number, form: FormData) {
	return modelGeneralAction(ProductModel, form, id)
}
