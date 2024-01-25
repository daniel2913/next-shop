"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DiscountModel, ProductModel } from "@/lib/DAL/Models"
import { sql } from "drizzle-orm"
import { DiscountCache } from "@/helpers/cachedGeters"
import { modelGeneralAction } from "./common"

export async function setDiscount(id: number, discount: number) {
	const session = await getServerSession(authOptions)
	if (discount < 1 || discount > 99) return false
	discount = Math.floor(discount)
	if (!session?.user?.role || session.user.role !== "admin") return false
	const res = await DiscountModel.raw(sql.raw(`
		UPDATE shop.discounts
			SET discount=${discount}
		WHERE id = ${id}
		RETURNING id
	`))
	DiscountCache.revalidate()
	return res.length && discount
}

export async function toggleDiscount(id: number, prodId: number) {
	const [session, discounts] = await Promise.all([getServerSession(authOptions), DiscountCache.get()])
	if (!session?.user?.role || session.user.role !== "admin") return false
	const discount = discounts.find(dis => dis.id === id)
	if (!discount) return false
	const action = discount.products.includes(prodId)
		? `products=array_remove(products,${prodId})` 
		: `products=array_append(products,${prodId})`
		const res = await DiscountModel.raw(sql.raw(`
		UPDATE 
			shop.discounts
		SET
			${action}
		WHERE 
			id = ${id}
		RETURNING
			id;
	`))

	DiscountCache.revalidate()
	return res.length !== 0
}

export async function addDiscount(type: "products" | "categories" | "brands", id: number, targId: number) {
	if (type !== "products" && type !== "categories" && type !== "brands") return false
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role !== "admin") return false
	const res = await DiscountModel.raw(sql.raw(`
		UPDATE shop.discounts
			SET ${type}=array_append(${type},${targId})
		WHERE 
				id = ${id}
			AND
				NOT ${id} = ANY(${type})
		RETURNING id;
	`))

	DiscountCache.revalidate()
	return res.length === 0
}

export async function setExpire(id: number, expires: string) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role !== "admin") return false
	const res = await DiscountModel.raw(sql.raw(`
		UPDATE shop.discounts
			SET expires=timestamp '${expires}'
		WHERE 
				id = ${id}
		RETURNING id;
	`))
	DiscountCache.revalidate()
	console.log(res.length)
	return res.length === 0
}

export async function getGroupDiscounts({ brand, category, product }: { brand?: number, category?: number, product?: number }) {
	if (!brand && !category && !product) return false
	if (product) {
		const actProd = await ProductModel.findOne({ id: product.toString() })
		if (!actProd) return false
		category = actProd.category
		brand = actProd.brand
	}
	const discounts = await DiscountCache.get()
	return discounts.filter(discount=>discount.brands.includes(brand||-1)||discount.categories.includes(category||-1))
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
