"use server"
import { BrandCache } from "@/helpers/cachedGeters"
import { BrandModel } from "@/lib/DAL/Models"
import { ServerError, modelGeneralAction } from "./common"

export async function getAllBrandNamesAction() {
	try{
	const res = await BrandCache.get()
	return res.map(brand => brand.name)
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function createBrandAction(form: FormData) {
	return modelGeneralAction(BrandModel,form)
}

export async function changeBrandAction(id: number, form: FormData) {
	return modelGeneralAction(BrandModel,form,id)
}
