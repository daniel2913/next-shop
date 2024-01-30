"use server"
import { CategoryCache } from "@/helpers/cachedGeters"
import { CategoryModel } from "@/lib/DAL/Models"
import { modelGeneralAction } from "./common"


export async function getAllCategoryNamesAction(){
	const res = await CategoryCache.get()
	return res.map(cat=>cat.name)
}

export async function createCategoryAction(form: FormData) {
	return modelGeneralAction(CategoryModel,form)
}

export async function changeCategoryAction(id: number, form: FormData) {
	return modelGeneralAction(CategoryModel,form,id)
}
