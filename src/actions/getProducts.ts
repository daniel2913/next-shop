"use server"
import { ProductModel } from "@/lib/DAL/Models"
import { populateProducts } from "@/helpers/getProducts"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { deleteImages, handleImages} from "@/helpers/images"
import {z} from "zod"
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

const IMAGE_TYPES = ["image/jpeg","image/jpg"]
const IMAGE_MAX_SIZE = 500000

const fileSchema = z
		.instanceof(File)
		.refine(file=>file.size <= IMAGE_MAX_SIZE,"File too big")
		.refine(file=>IMAGE_TYPES.includes(file.type),"File is not an image")


const schema = z.object({
	name: z.string().max(64),
	description: z.string().max(2048),
	brand: z.number().min(0),
	category: z.number().min(0),
	price: z.number().min(1),
	images: z.array(fileSchema)
})


function parseFormData(formData:FormData){
	const POJO:any = {}
	for (const [key,value] of formData.entries()){
		if (key in POJO){
			if (!Array.isArray(POJO[key]))
				POJO[key] = [POJO[key],value]
			else
				POJO[key].push(value)
		}
		else
			POJO[key] = value
	}
	return POJO as {[key:string]:unknown}
}

export async function createProduct(form:FormData){

	const [session,brands,categories] = await Promise.all([
		getServerSession(authOptions),
		BrandCache.get(),
		CategoryCache.get()
	])
	const props = parseFormData(form)

	if (session?.user?.role!=="admin") return "403"
	if (!("brand" in props || "category" in props ||"price" in props || "images" in props)) return "400"

	props.brand = brands.find(b=>b.name===form.get("brand"))?.id||-1
	props.category = categories.find(b=>b.name===form.get("category"))?.id||-1
	props.price = Number(props.price)
	props.images = Array.isArray(props.images) ? props.images : [props.images]
	const propsValid = schema.safeParse(props)
	if (!propsValid.success) return propsValid.error.toString()
	const ProductProps = propsValid.data

	let images = await handleImages(ProductProps.images,"products")
	if (!images) images = ["template.jpg"]

	ProductProps.images = images
	try {
		const res = await ProductModel.newObject(ProductProps)
		if (!res) {
			deleteImages(images,"products")
			return "400"
		}
		return false
	} catch (error) {
		deleteImages(images,"products")
		console.error(error)
		return "Some error"
	}
}

export async function changeProductAction(id:number,form:FormData){

	const [session,brands,categories,original] = await Promise.all([
		getServerSession(authOptions),
		BrandCache.get(),
		CategoryCache.get(),
		ProductModel.findOne({id:id.toString()})
	])
	const props = parseFormData(form)
 

	if (session?.user?.role!=="admin") return "403"
	if (!("brand" in props || "category" in props ||"price" in props || "images" in props)) return "400"

	props.brand = brands.find(b=>b.name===form.get("brand"))?.id||-1
	props.category = categories.find(b=>b.name===form.get("category"))?.id||-1
	props.price = Number(props.price)
	props.images = Array.isArray(props.images) ? props.images : [props.images]
	

	const propsValid = schema.safeParse(props)
	if (!propsValid.success) return propsValid.error.toString()
	const ProductProps = propsValid.data
	const images = await handleImages(ProductProps.images,"products")
	if (!images) return "Image problem"
	const forDeletion = original.images.filter(oldImage=>!images.includes(oldImage))
	deleteImages(forDeletion,"products")
	ProductProps.images = images
	
	 ProductModel.patch(id,ProductProps)
}
