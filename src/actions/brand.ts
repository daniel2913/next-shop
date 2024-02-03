"use server"
import { BrandCache } from "@/helpers/cachedGeters"
import { BrandModel } from "@/lib/DAL/Models"
import { modelGeneralAction } from "./common"

export async function getAllBrandNamesAction() {
	const res = await BrandCache.get()
	return res.map(brand => brand.name)
}

export async function createBrandAction(form: FormData) {
	return modelGeneralAction(BrandModel,form)
		.catch(err=>{throw err})
}

export async function changeBrandAction(id: number, form: FormData) {
	return modelGeneralAction(BrandModel,form,id)
}
