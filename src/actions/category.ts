"use server"
import { CategoryCache } from "@/helpers/cachedGeters"
import { CategoryModel } from "@/lib/Models"
import { ServerError, modelGeneralAction } from "./common"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { inArray } from "drizzle-orm"


export async function getAllCategoryNamesAction(){
	try{
	const res = await CategoryCache.get()
	return res.map(cat=>cat.name)
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}


export async function deleteCategoriesAction(inp:number|number[]){
	try{
	const ids = [inp].flat()
	if (!ids.length) throw ServerError.invalid()
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "admin") throw ServerError.notAllowed()
	const res = await CategoryModel.model
		.delete(CategoryModel.table)
		.where(inArray(CategoryModel.table.id,ids))
		.returning({id:CategoryModel.table.id})
	if (res.length)
		CategoryCache.revalidate()
	return res.length
	}
	catch(error){
		ServerError.fromError(error).emmit()
	}
}

export async function createCategoryAction(form: FormData) {
	const res = modelGeneralAction(CategoryModel,form)
	if (typeof res === "object" && !("error" in res)) CategoryCache.revalidate()
	return res
}

export async function changeCategoryAction(id: number, form: FormData) {
	const res = await modelGeneralAction(CategoryModel,form,id)
	if (typeof res === "object" && !("error" in res)) CategoryCache.revalidate()
	return res
}
