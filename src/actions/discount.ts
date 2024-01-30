"use server"

import { DiscountModel, ProductModel } from "@/lib/DAL/Models"
import { DiscountCache } from "@/helpers/cachedGeters"
import { modelGeneralAction } from "./common"

export async function getGroupDiscounts({ brand, category, product }: { brand?: number, category?: number, product?: number }) {
	if (!brand && !category && !product) return null
	if (product) {
		const actProd = await ProductModel.findOne({ id: product})
		if (!actProd) return null
		category = actProd.category
		brand = actProd.brand
	}
	const discounts = await DiscountCache.get()
	return discounts.filter(discount=>
		discount.brands.includes(brand||-1)
	||discount.categories.includes(category||-1))
}

export async function getAllDiscounts() {
	const discounts = await DiscountCache.get()
	return discounts
}

export async function createDiscountAction(form: FormData) {
	return modelGeneralAction(DiscountModel,form)
}

export async function changeDiscountAction(id: number, form: FormData) {
	return modelGeneralAction(DiscountModel,form,id)
}
