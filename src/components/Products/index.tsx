import ProductCard from "@/components/product/ProductCard";
import { ProductModel, User } from "@/lib/DAL/Models";
import {
	collectQueries,
} from "@/lib/DAL/controllers/universalControllers";
import { UserCache, getAllBrands, getAllCategories, getAllDiscounts } from "@/helpers/cachedGeters";
import { PopulatedProduct } from "@/lib/DAL/Models/Product";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type TSearchParams = { [key: string]: string | string[] | undefined };

const unknownBrand = {
	name: "unknown",
	image: "template.jpg",
	description: "not found",
	id: -1
}

const unknownCategory = {
	name: "unknown",
	image: "template.jpg",
	id: -1
}

const unknownDiscount = {
	id: -1,
	products: [],
	brands: [],
	categories: [],
	discount: 0,
	expires: new Date()
}

export async function getProducts(searchParams: TSearchParams, ) {
	const query = collectQueries(searchParams, {
		model: ProductModel,
	}) ////FIX!!!
	if (query.brand)
		query.brand =
			brandList?.find((brand) => brand.id.toString() === query.brand)?.id.toString() || "";
	if (query.category)
		query.category =
			categoryList?.find((cat) => cat.id.toString() === query.category)?.id.toString() || "";


	const [ session,products, brandList, categoryList, discountList] = await Promise.all([
		getServerSession(authOptions),
		ProductModel.find(query),
		getAllBrands(),
		getAllCategories(),
		getAllDiscounts()
	]);
	let user:User|null = null
	if (session?.user?.name){
		user = await UserCache.get(session?.user?.name)
	}

	const populatedProducts = products.map((product) => {
		const brand = brandList.find((brand) => brand.id === product.brand);
		const category = categoryList.find((cat) => cat.id === product.category);
		const discount = discountList.find((dis) => dis.id in product.discounts);
		const ownVote = user?.bought[product.id.toString()] ?? -1
		console.log("===>",product,ownVote,user)
		return {

			...product,
			ownVote,
			voters: product.voters.length,
			brand: brand || unknownBrand,
			category: category || unknownCategory,
			discount: discount || unknownDiscount
		} as PopulatedProduct
	})
	return { products: populatedProducts, session }

}

export default async function ProductList({
	searchParams,
	session
}: {
		session:Session;
	searchParams: TSearchParams;
}) {
	const { products} = await getProducts(searchParams);
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
						session={session}
						product={product}
					/>
				))}
			</div>
		</div>
	);
}
