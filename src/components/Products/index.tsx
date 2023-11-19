import ProductCard from "@/components/product/ProductCard";
import { Brand, BrandModel, ProductModel } from "@/lib/DAL/Models";
import styles from "./index.module.scss";
import {
	Tconfig,
	collectQueries,
	getController,
} from "@/lib/DAL/controllers/universalControllers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllBrands, getAllCategories } from "@/helpers/cachedGeters";
import dbConnect from "@/lib/dbConnect";

type TSearchParams = { [key: string]: string | string[] | undefined };

export async function getProducts(searchParams: TSearchParams) {
	await dbConnect();
	const query = collectQueries(searchParams, {
		model: ProductModel,
	} as any as Tconfig<typeof ProductModel>); ////FIX!!!
	const brandList = await getAllBrands();
	const categoryList = await getAllCategories();
	const products = await ProductModel.find(query);

	return products.map((product) => {
		const brand = brandList.find((brand) => brand._id === product.brand);
		const category = categoryList.find((cat) => cat._id === product.category);
		return {
			...product,
			brand: brand?.name || "unknown",
			category: category?.name || "unknown",
			brandImage: brand?.image || "template.jpg",
		};
	});
}

export default async function ProductList({
	params,
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
			<div className={styles.featured}>
				<div className={styles.featuredProducts} />
				<div className={styles.featuredBrands} />
			</div>
			<div
				className="
					grid
					sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8
					p-5 h-full
				"
			>
				{products.map((product, i) => (
					<ProductCard
						className="			w-64 h-80
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
