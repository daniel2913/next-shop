"use server"

import { DiscountModel } from "@/lib/Models"
import { DiscountCache } from "@/helpers/cache"
import { ServerError, auth, modelGeneralAction } from "./common"
import { inArray } from "drizzle-orm"
import { toArray } from "@/helpers/misc"

export async function getAllDiscountsAction() {
	try {
		const discounts = await DiscountCache.get()
		return discounts
	} catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function deleteDiscountsAction(inp: number | number[]) {
	try {
		const ids = toArray(inp)
		if (!ids.length) throw ServerError.invalid()
		await auth("admin")
		const res = await DiscountModel.model
			.delete(DiscountModel.table)
			.where(inArray(DiscountModel.table.id, ids))
			.returning({ id: DiscountModel.table.id })
		if (res.length) DiscountCache.revalidate()
		return res.length
	} catch (error) {
		ServerError.fromError(error).emmit()
	}
}

export async function createDiscountAction(form: FormData) {
	const res = await modelGeneralAction(DiscountModel, form)
	if (!res) DiscountCache.revalidate()
	return res
}

export async function changeDiscountAction(id: number, form: FormData) {
	const res = await modelGeneralAction(DiscountModel, form, id)
	if (!res) DiscountCache.revalidate()
	return res
}
