"use server"
import { Product, ProductModel } from "@/lib/DAL/Models"
import { populateProducts } from "@/helpers/getProducts"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { deleteImages, handleImages, saveImages } from "@/helpers/images"

export async function getProductsByIdsAction(query: string | string[] | RegExp) {
	if (!query || (Array.isArray(query) && query.length === 0)) return []
	const products = await ProductModel.find({ id: query })
	return populateProducts(products)
}

type NewProductProps = {
	name:string
	description:string
	brand:string
	category:string
	price:number
	images:File[]|string[]
}


export async function createProduct(props:FormData){
	const [session,brands,categories] = await Promise.all([
		getServerSession(authOptions),
		BrandCache.get(),
		CategoryCache.get()
	])
	if (session?.user?.role!=="admin") return "403"
	const ProductProps:any = {
		...props,
		brand:brands.find(b=>b.name===props.brand)?.id,
		category:categories.find(c=>c.name===props.category)?.id
	}

	if (!ProductProps.brand||!ProductProps.category) 
		return "400 Brand|Category"
	const images = handleImages(props.images)
	if (!(await saveImages(images, "./public/products/")))
		return "500"
	
	try {
		const res = await ProductModel.newObject(props)
		console.log(res)
		if (!res) {
			deleteImages(
				images.map((image) => image.name),
				"./public/products/"
			)
			return "400"
		}
		return false
	} catch (error) {
		console.error(error)
		return "Some error"
	}
}
