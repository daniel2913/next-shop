import { collectQueries } from "@/lib/DAL/controllers/universalControllers"
import { Brand, Category, ProductModel, User } from "@/lib/DAL/Models"
import {
	BrandCache,
	CategoryCache,
	DiscountCache,
	UserCache,
} from "./cachedGeters"
import { PopulatedProduct, Product } from "@/lib/DAL/Models/Product"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


const unknownDiscount = {
	id: -1,
	products: [],
	brands: [],
	categories: [],
	discount: 0,
	expires: new Date(),
}

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
	image: "template.jpg",
	id: -1,
	votes: {},
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
					product.id in discount.products ||
					product.brand in discount.brands ||
					product.category in discount.categories
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
		return {
			...product,
			votes,
			voters,
			brand: brand || unknownBrand,
			category: category || unknownCategory,
			discount,
			ownVote,
		}
	})
	return populatedProducts
}

export async function getProducts(searchParams: TSearchParams) {
	const query = collectQueries(searchParams, {
		model: ProductModel,
	})
	const [brandList, categoryList, discountList] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
		DiscountCache.get(),
	])
	if (query.brand)
		query.brand =
			brandList
				.filter((brand) => query.brand?.indexOf(brand.name) != -1)
				.map(brand => brand.id.toString()) || ""
	if (query.category)
		query.category =
			categoryList
				.filter((cat) => query.category?.indexOf(cat.name) != -1)
				.map(cat => cat.id.toString()) || ""
	const products = await ProductModel.find(query,)

	return populateProducts(products)
}
