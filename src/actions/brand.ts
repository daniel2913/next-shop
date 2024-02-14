"use server"
import { BrandCache } from "@/helpers/cachedGeters"
import { BrandModel } from "@/lib/DAL/Models"
import { ServerError, modelGeneralAction } from "./common"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { inArray } from "drizzle-orm"

export async function getAllBrandNamesAction() {
	try{
	const res = await BrandCache.get()
	return res.map(brand => brand.name)
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function deleteBrandsAction(inp:number|number[]){
	try{
	const ids = [inp].flat()
	if (!ids.length) throw ServerError.invalid()
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "admin") throw ServerError.notAllowed()
	const res = await BrandModel.model
		.delete(BrandModel.table)
		.where(inArray(BrandModel.table.id,ids))
		.returning({id:BrandModel.table.id})
	if (res.length)
		await BrandCache.revalidate()
	return res.length
	}
	catch(error){
		ServerError.fromError(error).emmit()
	}
}

export async function createBrandAction(form: FormData) {
	const res = await modelGeneralAction(BrandModel,form)
	if (typeof res === "object" && !("error" in res)) BrandCache.revalidate()
	return res
}

export async function changeBrandAction(id: number, form: FormData) {
	const res = await modelGeneralAction(BrandModel,form,id)
	if (typeof res === "object" && !("error" in res)) BrandCache.revalidate()
	return res
}
