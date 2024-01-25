"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BrandCache } from "@/helpers/cachedGeters"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { fileSchema, parseFormData } from "@/lib/DAL/Models/common"
import { BrandModel } from "@/lib/DAL/Models"
import { deleteImages, handleImages } from "@/helpers/images"
import { modelGeneralAction } from "./common"

export async function getAllBrandNamesAction() {
	const res = await BrandCache.get()
	return res.map(brand => brand.name)
}

export async function createBrandAction(form: FormData) {
	return modelGeneralAction(BrandModel,form)
}

export async function changeBrandAction(id: number, form: FormData) {
	return modelGeneralAction(BrandModel,form,id)
}
