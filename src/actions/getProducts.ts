"use server"
import { ProductModel } from "@/lib/DAL/Models"
import { populateProducts } from "@/helpers/getProducts"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { parseFormData } from "@/lib/DAL/Models/common"

export async function getProductsByIdsAction(query: string | string[] | RegExp) {
	if (!query || (Array.isArray(query) && query.length === 0)) return []
	const products = await ProductModel.find({ id: query })
	return populateProducts(products)
}



export async function createProduct(form:FormData){

	const session = await getServerSession(authOptions)
	if (session?.user?.role!=="admin") return "Unauthorized"

	const props = parseFormData(form)

	try {
		const res = await ProductModel.create(props)
		if (!res) {
			return "???"
		}
		return false
	} catch (error) {
		console.error(error)
		return String(error)
	}
}

export async function changeProductAction(id:number,form:FormData){

	const session = await getServerSession(authOptions)

	if (session?.user?.role!=="admin") return "Not Authorized"

	const props = parseFormData(form)

	try{
	 const res = await ProductModel.patch(id,props)
		if (!res) return "???"
		return false
	}
	catch(error){
		return String(error)
	}
}
