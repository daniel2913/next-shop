"use server"

import { DiscountModel } from "@/lib/Models"
import { DiscountCache } from "@/helpers/cachedGeters"
import { ServerError, modelGeneralAction } from "./common"
import { inArray } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


export async function getAllDiscounts() {
	try{
	const discounts = await DiscountCache.get()
	return discounts
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function deleteDiscountsAction(inp:number|number[]){
	try{
	const ids = [inp].flat()
	if (!ids.length) throw ServerError.invalid()
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "admin") throw ServerError.notAllowed()
	const res = await DiscountModel.model
		.delete(DiscountModel.table)
		.where(inArray(DiscountModel.table.id,ids))
		.returning({id:DiscountModel.table.id})
	if (res.length)
		DiscountCache.revalidate()
	return res.length
	}
	catch(error){
		ServerError.fromError(error).emmit()
	}
}

export async function createDiscountAction(form: FormData) {
	const res = await modelGeneralAction(DiscountModel,form)
	if (typeof res === "object" && !("error" in res)) DiscountCache.revalidate()
	return res
}

export async function changeDiscountAction(id: number, form: FormData) {
	const res = await modelGeneralAction(DiscountModel,form,id)
	if (typeof res === "object" && !("error" in res)) DiscountCache.revalidate()
	return res
}
