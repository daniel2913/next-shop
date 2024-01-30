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
	votes: {},
	saved:[],
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
	const populatedProducts = products.map((product) => {
		const brand = brands.find((brand) => brand.id === product.brand)
		const category = categories.find(
			(category) => category.id === product.category
		)
		const applicableDiscounts = discounts.filter(
			(discount) => Number(discount.expires) > Date.now() &&
				(
					 discount.products.includes(product.id) ||
					 discount.brands.includes(product.brand) ||
					 discount.categories.includes(product.category )
				)
		)
		const discount = applicableDiscounts.reduce(
			(prev, next) =>
			(prev =
				next.discount > prev.discount && {
					discount: next.discount,
					expires: next.expires,
				} ||
				prev),
			{ discount: 0, expires: new Date() }
		)

		const voterIdx = product.voters.indexOf(user.id)
		const ownVote = voterIdx === -1
			? -1
			: product.votes[voterIdx] || 0
		const votes = product.votes.reduce((prev, next) => prev + next, 0)
		const voters = product.votes.reduce(
			(prev, next) => (next ? prev + 1 : prev),
			0
		)
		const favourite = user.saved?.includes(product.id) || false
		return {
			...product,
			votes,
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

