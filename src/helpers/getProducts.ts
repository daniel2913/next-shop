"use server"
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
import { sql } from "drizzle-orm"


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

export async function getProducts(searchParams: URLSearchParams) {
	const [brands,categories] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get()
	])
	const brand = searchParams.getAll("brand")
		.filter(brand=>brands.find(_brand=>_brand.name===brand))
		.map(brand=>brands.find(_brand=>_brand.name===brand)!.id)
	const category = searchParams.getAll("category")
		.filter(category=>categories.find(_category=>_category.name===category))
		.map(category=>categories.find(_category=>_category.name===category)!.id)
	const skip = searchParams.get("skip") || '0'
	const page = searchParams.get("page") || '10'
	const name = searchParams.get("name")
	let constrains = ''
	if (brand.length||category.length||name){
		constrains = "WHERE "
		if (brand.length){
			constrains+=`brand IN (${brand}) `
		}
		if (brand.length & category.length)
			constrains+= "AND "

		if (category.length){
			constrains+=`category IN (${category}) `
		}
		if ((brand.length || category.length)&&name)
			constrains+= "AND "
		if (name)
			constrains+=`(name ILIKE '${name}%' OR name ILIKE '%${name}')`
	}

	const products = await ProductModel.raw(sql.raw(`
		SELECT * FROM shop.products
		${constrains}
		LIMIT ${page} OFFSET ${skip};
	`)) as any as Product[]

	return await populateProducts(products)
}
	
