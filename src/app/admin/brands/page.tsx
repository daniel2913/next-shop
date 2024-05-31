import React from "react";
import { BrandModel } from "@/lib/Models";
import BrandsAdmin from "@/components/admin/brands/BrandsAdmin";

export default async function AdminBrandsPage() {
	const brandsPromise = BrandModel.model.select().from(BrandModel.table);
	const brands = await brandsPromise;
	if ("error" in brands) throw brands.error;
	return <BrandsAdmin className="w-full" brands={brands} />;
}
