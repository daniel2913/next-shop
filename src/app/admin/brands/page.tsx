import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import React from "react"
import { BrandModel } from "@/lib/Models"
import BrandsAdmin from "@/components/admin/brands/BrandsAdmin"

export default async function AdminBrandsPage() {
	const brandsPromise = BrandModel.model.select().from(BrandModel.table)
	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "admin") redirect("/shop/home")
	const brands = await brandsPromise
	if ("error" in brands) throw brands.error
	return (
		<BrandsAdmin
			className="w-full"
			brands={brands}
		/>
	)
}
