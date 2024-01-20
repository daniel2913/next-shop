"use server"
import { CategoryCache } from "@/helpers/cachedGeters"


export async function getAllCategoryNamesAction(){
	const res = await CategoryCache.get()
	return res.map(cat=>cat.name)
}
