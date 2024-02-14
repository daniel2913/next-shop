import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { CategoryModel } from "@/lib/DAL/Models";
import CategoriesAdmin from "@/components/category/CategoriesAdmin";

export default async function AdminCategories(){

	const catPromise = CategoryModel.model.select().from(CategoryModel.table)
	const session = await getServerSession(authOptions)
	if (session?.user?.role!=="admin") redirect("/shop/home")
	const categories = await catPromise
	if ("error" in categories) throw categories.error
	return(
		<CategoriesAdmin className="w-full" categories={categories}/>
	)
}
