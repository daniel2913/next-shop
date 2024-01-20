"use server"
import { BrandCache } from "@/helpers/cachedGeters"

export async function getAllBrandNamesAction(){
	const res = await BrandCache.get()
	return res.map(brand=>brand.name)
}
