"use server"
import { ProductModel, BrandModel, CategoryModel, DiscountModel } from "@/lib/DAL/Models"
import { populateProducts } from "@/helpers/getProducts"
import { and, or, eq, ilike, inArray, gt, sql } from "drizzle-orm"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { ServerError, modelGeneralAction } from "./common"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"



export async function getAllProductsAction() {
	try {
		const session = await getServerSession(authOptions)
		if (session?.user?.role !== "admin") throw ServerError.notAllowed()
		const products = await ProductModel.find()
		return await populateProducts(products)
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function getProductsByIds(query: number | number[]) {
	query = z.number().or(z.array(z.number())).parse(query)
	if (Array.isArray(query) && query.length === 0) return []
	const products = await ProductModel.find({ id: query })
	return populateProducts(products)
}

export async function getProductsByIdsAction(query: number | number[]) {
	try {
		return await getProductsByIds(query)
	}
	catch (error) {
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
	brand: z.array(z.string()).optional().transform(ar => ar && ar?.length > 0 ? ar : undefined),
	category: z.array(z.string()).optional().transform(ar => ar && ar?.length > 0 ? ar : undefined),
	name: z.string().optional(),
	skip: z.coerce.number().default(0),
	page: z.coerce.number().default(20)
})


export async function getProductsPageAction(params: Params) {
	try {
		const { brand, category, name, skip, page, } = querySchema.parse(params)
		let brandIds: number[]
		if (brand && brand.length > 0) {
			const brands = await BrandCache.get()
			brandIds = brand
				.filter(brand => brands.find(_brand => _brand.name === brand))
				.map(brand => brands.find(_brand => _brand.name === brand)!.id)
		}
		let categoryIds: number[]
		if (category && category.length > 0) {
			const categories = await CategoryCache.get()
			categoryIds = category
				.filter(category => categories.find(_category => _category.name === category))
				.map(category => categories.find(_category => _category.name === category)!.id)
		}
	/* const products = await ProductModel.model.execute(sql.raw(`
with pre as (
select distinct on (products.id) products.name as name,
  products.description as description,
  products.images as images,
  products.price as price,
  cardinality(products.voters) as voters,
  products.rating as rating,
  brandsc as brandc,
  categoriesc as categoryc,
  discountsc.discount as discount
from shop.products
inner join shop.brands as brandsc
	on brandsc.id = products.brand 
inner join shop.categories as categoriesc
	on categoriesc.id = products.category 
left join shop.discounts as discountsc
	on (
			discountsc.expires > now() 
		and 
			(
				products.id = any(discountsc.products) 
			or products.brand = any(discountsc.brands) 
			or products.category = any(discountsc.categories)
			)		
	)
where (
	1=1
	and ${(categoryIds && `products.category = any(${categoryIds})`) || "1=1"}

	and ${(brandIds && `products.brand = any(${brandIds})`) || "1=1"}

	and ${(name && `products.name ilike '%${name}%'`) || "1=1"}
)
order by products.id, discountsc.discount desc nulls last
)
select c.name as name,
	c.description as description,
	c.price as price,
	c.images as images,
	c.rating as rating,
	c.voters as voters,
	c.discount as discount,
	row_to_json(c.brandc) as brand,
	row_to_json(c.categoryc) as category from pre c
	limit(${page}) offset(${skip})
`))
return products */
// 	.where(and(
		// 		brandIds?.length &&	inArray(ProductModel.table.brand,brandIds) || undefined,
		// 		categoryIds?.length &&	inArray(ProductModel.table.category,categoryIds) || undefined,
		// 		name?.length &&	ilike(ProductModel.table.name,`%${name}%`) || undefined,
		// 	))
		// 	.orderBy(ProductModel.table.id,sql`${DiscountModel.table.discount} desc nulls last`)
		// 	)
		// 		.offset(+skip)
		// 	.limit(+page)
		// console.log(popProducts.toSQL())
		// console.log(await popProducts,"\n\n\n\n")

		// const products = ProductModel.model
		// 	.select()
		// 	.from(ProductModel.table)
		// 	.where(and(
		// 		brandIds?.length &&	inArray(ProductModel.table.brand,brandIds) || undefined,
		// 		categoryIds?.length &&	inArray(ProductModel.table.category,categoryIds) || undefined,
		// 		name?.length &&	ilike(ProductModel.table.name,`%${name}%`) || undefined,
		// 		))
		// 	.offset(+skip)
		// 	.limit(+page)
		// return populateProducts(await products)
		// }
		//
	const products = await ProductModel.find({
			name:(name&&new RegExp(name))||undefined,
			brand:brandIds,
			category:categoryIds
	}, page,skip)
	return populateProducts(products)
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}

}

export async function createProductAction(form: FormData) {
	return modelGeneralAction(ProductModel, form)
}

export async function changeProductAction(id: number, form: FormData) {
	return modelGeneralAction(ProductModel, form, id)
}
