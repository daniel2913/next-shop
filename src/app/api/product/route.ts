import { NextRequest, NextResponse } from "next/server"
import {sql} from "drizzle-orm"
import { Product, ProductModel } from "@/lib/DAL/Models"
import {
	addController,
	deleteController,
	getController,
	patchController,
	Tconfig,
	collectFromForm,
	collectQueries,
} from "@/lib/DAL/controllers/universalControllers"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { populateProducts } from "@/helpers/getProducts"

const config: Tconfig<typeof Product> = {
	DIR_PATH: "./public/products/",
	model: ProductModel,
	multImages: true,
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const [brands,categories] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get()
	])
	const brand = searchParams.getAll("brand")
		.filter(brand=>brands.find(_brand=>_brand.name===brand))
		.map(brand=>brands.find(_brand=>_brand.name===brand)!.id)
	const category = searchParams.getAll("category")
		.filter(category=>categories.find(_category=>_category.name===category))
		.map(category=>categories.find(_category=>_category.name===category)!.id)
	const skip = searchParams.get("skip") || '0'
	const page = searchParams.get("page") || '20'
	let constrains = ''
	if (brand.length||category.length){
		constrains = "WHERE "
		if (brand.length){
			constrains+=`brand IN (${brand}) `
		}
		if (brand.length & category.length)
			constrains+= "AND "

		if (category.length){
			constrains+=`category IN (${category}) `
		}
	}

	const products = await ProductModel.raw(sql.raw(`
		SELECT * FROM shop.products
		${constrains}
		LIMIT ${page} OFFSET ${skip};
	`)) as any as Product[]
	return NextResponse.json(await populateProducts(products))
}

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
	const props: any = collectFromForm(await req.formData(), config)
	return addController(props, config)
}

export async function DELETE(req: NextRequest): Promise<NextResponse<any>> {
	const { id } = await req.json()
	return deleteController(id, config)
}

export async function PATCH(req: NextRequest): Promise<NextResponse<any>> {
	const props: any = collectFromForm(await req.formData(), config)
	return patchController({ ...props }, config)
}
