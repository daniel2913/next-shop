"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BrandCache } from "@/helpers/cachedGeters"
import { getServerSession } from "next-auth"
import { parseFormData } from "./getProducts"
import {z} from "zod"
import { fileSchema } from "@/lib/DAL/Models/common"
import { BrandModel } from "@/lib/DAL/Models"
import { deleteImages, handleImages } from "@/helpers/images"

export async function getAllBrandNamesAction(){
	const res = await BrandCache.get()
	return res.map(brand=>brand.name)
}

const schema = z.object({
	name:z.string(),
	description:z.string(),
	image: fileSchema
})

export async function createBrandAction(form:FormData){

	const session	=await  getServerSession(authOptions)

	if (session?.user?.role!=="admin") return "Not Authorized"

	const props = await parseFormData(form)

	props.image = Array.isArray(props.image) ? props.image.slice(0,1) : [props.image]
	const propsValid = schema.safeParse(props)
	if (!propsValid.success) return propsValid.error.toString()

	const brandProps = propsValid.data

	let images = await handleImages(brandProps.images,"brands")


	brandProps.image = (images ||"template.jpg") as File
	try {
		const res = await BrandModel.create(brandProps)
		if (!res) {
			deleteImages(images,"brands")
			return "400"
		}
		return false
	} catch (error) {
		deleteImages(images,"brands")
		console.error(error)
		return "Some error"
	}
}

export async function changeBrandAction(id:number,form:FormData){

	const [session,original] = await Promise.all([
		getServerSession(authOptions),
		BrandModel.findOne({id:id.toString()})
		])
	if (session?.user?.role!=="admin") return "Not Authorized"
	if (!original) return "Not Found"
	const props = parseFormData(form)
 	
	props.image = Array.isArray(props.image) ? props.image.slice(0,1) : [props.image]
	

	const propsValid = schema.safeParse(props)

	if (!propsValid.success) return propsValid.error.toString()
	const brandProps = propsValid.data

	const image = await handleImages(brandProps.image,"brands")
	if (!image) return "Image problem"
	const forDeletion = original.image === image ? [] : [original.image]
	brandProps.image = image
	
	 BrandModel.patch(id,brandProps)
	deleteImages(forDeletion,"brands")
}
