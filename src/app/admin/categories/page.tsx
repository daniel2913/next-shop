import React from "react";
import { CategoryModel } from "@/lib/Models";
import CategoriesAdmin from "@/components/admin/categories/CategoriesAdmin";

export default async function AdminCategoriesPage() {
	const catPromise = CategoryModel.model.select().from(CategoryModel.table);
	const categories = await catPromise;
	if ("error" in categories) throw categories.error;
	return <CategoriesAdmin className="w-full" categories={categories} />;
}
