import { getAllProductsAction } from "@/actions/product";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductsAdmin from "@/components/product/ProductsAdmin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminProductsPage(){

	const productsPromise = getAllProductsAction()
	const session = await getServerSession(authOptions)
	if (session?.user?.role!=="admin") redirect("/shop/home")
	const products = await productsPromise
	if ("error" in products) throw products.error
	return(
		<ProductsAdmin className="w-full" products={products}/>
	)
}
