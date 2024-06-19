import { getAllProductsAction } from "@/actions/product";
import ProductsAdmin from "@/components/admin/products/ProductsAdmin";
import { cookies } from "next/headers";

export default async function AdminProductsPage() {
	const products = await getAllProductsAction();
	//const cookie = cookies().get("cookie")
	//if (cookie) throw "Error"
	if ("error" in products) return products.error;
	return <ProductsAdmin className="w-full" products={products} />;
}
