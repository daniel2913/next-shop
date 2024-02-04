"use server"

import { DiscountModel, ProductModel } from "@/lib/DAL/Models"
import { DiscountCache } from "@/helpers/cachedGeters"
import { ServerError, modelGeneralAction } from "./common"


export async function getAllDiscounts() {
	try{
	const discounts = await DiscountCache.get()
	return discounts
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function createDiscountAction(form: FormData) {
	return modelGeneralAction(DiscountModel,form)
}

export async function changeDiscountAction(id: number, form: FormData) {
	return modelGeneralAction(DiscountModel,form,id)
}
