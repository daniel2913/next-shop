"use server"
import { Brand, Category, User } from "@/lib/DAL/Models"
import {
	BrandCache,
	CategoryCache,
	DiscountCache,
	UserCache,
} from "./cachedGeters"
import { PopulatedProduct, Product } from "@/lib/DAL/Models/Product"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const unknownBrand: Brand = {
	name: "unknown",
	image: "template.jpg",
	description: "not found",
	id: -1,
}

const unknownCategory: Category = {
	name: "unknown",
	image: "template.jpg",
	id: -1,
}

const unknownUser: Omit<User, "passwordHash" | "cart"> = {
	name: "Guest",
	role: "guest",
	id: -1,
	saved: [],
}

export async function populateProducts(
	products: Product[]
): Promise<PopulatedProduct[]> {
	const [brands, categories, discounts, session] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
		DiscountCache.get(),
		getServerSession(authOptions),
	])
	const user = session?.user?.name
		? (await UserCache.get(session?.user?.name)) || unknownUser
		: unknownUser
	const now = Date.now()
	const applicableDiscounts = discounts.filter(
		(discount) => Number(discount.expires) > now)
	const populatedProducts = products.map((product) => {
		const brand = brands.find((brand) => brand.id === product.brand)
		const category = categories.find((category) => category.id === product.category)
		const discount = applicableDiscounts.reduce((prev, next) => {
			if (next.discount <= prev) return prev
			if (
				next.categories.includes(product.category)
				|| next.brands.includes(product.brand)
				|| next.products.includes(product.id)
			)
				return next.discount
			return prev
		}, 0)

		const voterIdx = product.voters.indexOf(user.id)
		const ownVote = voterIdx === -1
			? -1
			: product.votes[voterIdx] || 0
		const voters = product.votes
			.filter(Boolean)
			.reduce(prev => ++prev, 0)
		const favourite = user.saved?.includes(product.id) || false
		return {
			...product,
			favourite,
			voters,
			brand: brand || unknownBrand,
			category: category || unknownCategory,
			discount,
			ownVote,
		}
	})
	return populatedProducts
}
