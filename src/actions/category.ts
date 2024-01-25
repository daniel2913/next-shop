"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CategoryCache } from "@/helpers/cachedGeters"
import { CategoryModel } from "@/lib/DAL/Models"
import { parseFormData } from "@/lib/DAL/Models/common"
import { getServerSession } from "next-auth"
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
