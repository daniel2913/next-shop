import ProductCard from "@/components/product/ProductCard";
import { ProductModel } from "@/lib/DAL/Models";
import {
	Tconfig,
	collectQueries,
} from "@/lib/DAL/controllers/universalControllers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
		import { getAllBrands, getAllCategories, getAllDiscounts } from "@/helpers/cachedGeters";
import { PopulatedProduct } from "@/lib/DAL/Models/Product";

type TSearchParams = { [key: string]: string | string[] | undefined };

const unknownBrand = {
	name:"unknown",
	image:"template.jpg",
	description:"not found",
	id:-1
}

const unknownCategory = {
	name:"unknown",
	image:"template.jpg",
	id:-1
}

const unknownDiscount = {
	id:-1,
	products:[],
	brands:[],
	categories:[],
	discount:0,
	expires:new Date()
}

export async function getProducts(searchParams: TSearchParams) {
	const query = collectQueries(searchParams, {
		model: ProductModel,
	} as any as Tconfig<typeof ProductModel>); ////FIX!!!
	const [brandList, categoryList, discountList] = await Promise.all([
		getAllBrands(),
		getAllCategories(),
		getAllDiscounts()
	]);
	if (query.brand)
		query.brand =
			brandList?.find((brand) => brand.id.toString() === query.brand)?.id.toString() || "";
	if (query.category)
		query.category =
			categoryList?.find((cat) => cat.id.toString() === query.category)?.id.toString() || "";
	const products = await ProductModel.find(query);

	return products.map((product) => {
		const brand = brandList.find((brand) => brand.id === product.brand);
		const category = categoryList.find((cat) => cat.id === product.category);
		const discount = discountList.find((dis)=> dis.id in product.discounts);
		return {
			...product,
			votes:product?.votes?.length,
			voters: null,
			brand: brand || unknownBrand,
			category: category || unknownCategory,
			discount : discount || unknownDiscount
		} as PopulatedProduct;
});
}

export default async function ProductList({
	searchParams,
}: {
	params: { link: string };
	searchParams: TSearchParams;
}) {
	const role: "admin" | "user" =
		(await getServerSession(authOptions))?.user?.role || "user";
	const products = await getProducts(searchParams);
	return (
		<div className="bg-green-100">
			<div className="">
				<div className="" />
				<div className="" />
			</div>
			<div
				className="
					grid- grid
					h-full p-5 sm:grid-cols-2
					md:grid-cols-3 lg:grid-cols-4
				"
			>
				{products.map((product, i) => (
					<ProductCard
						className="	h-80 w-64 p-2
						"
						key={`${product.brand}/${product.name}`}
						role={role}
						product={product}
					/>
				))}
			</div>
		</div>
	);
}
