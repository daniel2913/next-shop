import ProductCard from "@/components/product/ProductCard";
import { Brand, Category, ProductModel, User } from "@/lib/DAL/Models";
import {
	collectQueries,
} from "@/lib/DAL/controllers/universalControllers";
import { BrandCache, CategoryCache, DiscountCache, UserCache, } from "@/helpers/cachedGeters";
import { PopulatedProduct, Product } from "@/lib/DAL/Models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type TSearchParams = { [key: string]: string | string[] | undefined };


const unknownDiscount = {
	id: -1,
	products: [],
	brands: [],
	categories: [],
	discount: 0,
	expires: new Date()
}

const unknownBrand:Brand = {
	name: "unknown",
	image: "template.jpg",
	description: "not found",
	id: -1
}

const unknownCategory:Category = {
	name: "unknown",
	image: "template.jpg",
	id: -1
}

const unknownUser:Omit<User,'passwordHash'|'cart'> = {
	name: "Guest",
	role:"guest",
	image: "template.jpg",
	id:-1,
	votes:{}
}

export async function populateProducts(products:Product[]):Promise<PopulatedProduct[]>{
	const [brands,categories,discounts,session] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
		DiscountCache.get(),
		getServerSession(authOptions)
	])
	const user = session?.user?.name 
		?(await UserCache.get(session?.user?.name)) || unknownUser 
		: unknownUser
	const populatedProducts = products.map(product=>{
	const brand =brands.find(brand=>brand.id===product.brand) 
	const category =categories.find(category=>category.id===product.category) 
	const applicableDiscounts = discounts.filter(discount=>discount.id in product.discounts)
	const discount = applicableDiscounts.reduce((prev,next)=>
		prev = Number(next.expires)>Date.now() && next.discount>prev.discount && {discount:next.discount,expires:next.expires} || prev,
		{discount:0,expires:new Date()}
	)
	const ownVote = user.votes[product.id]
	
	return({
		...product,
		voters:product.voters.length,
		brand:brand || unknownBrand,
		category:category || unknownCategory,
		discount,
		ownVote
		})
	})
	return populatedProducts
}



async function getProducts(searchParams: TSearchParams, ) {
	const query = collectQueries(searchParams, {
		model: ProductModel,
	})
		
	const [brandList,categoryList,discountList] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
		DiscountCache.get(),
	])

	if (query.brand)
		query.brand =
			brandList?.find((brand) => brand.id.toString() === query.brand)?.id.toString() || "";
	if (query.category)
		query.category =
			categoryList?.find((cat) => cat.id.toString() === query.category)?.id.toString() || "";

	const products = await ProductModel.find(query)
	
	return populateProducts(products)

}

export default async function ProductList({
	searchParams,
}: {
	searchParams: TSearchParams;
}) {
	const products = await getProducts(searchParams);
	return (
		<div className="bg-green-100">
			<div className="">
				<div className="" />
				<div className="" />
			</div>
			<div
				className="
					grid
					h-full p-5 sm:grid-cols-2
					md:grid-cols-3 lg:grid-cols-4
				"
			>
				{products.map((product) => (
					<ProductCard
						className="	h-80 w-64 p-2
						"
						key={`${product.brand}/${product.name}`}
						product={product}
					/>
				))}
			</div>
		</div>
	);
}
