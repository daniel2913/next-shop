import React  from "react"
import Auth from "../UI/Auth"
import CartStatus from "../cart/Status"
import Search from "../UI/Search"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { getProductsByIdsAction } from "@/actions/product"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminPanel from "../admin/AdminPanel"


export default async function NavBar() {
	const session = await getServerSession(authOptions)
	const brands = BrandCache.get()
	const categories = CategoryCache.get()
	return (
		<header
			className="
				relative left-0 right-0 top-0
				flex h-12 items-center
				bg-secondary px-5
				py-1"
		>
			<div className="h-full w-20 bg-accent1-400" />
			<Search
				className="mx-auto h-4/5"
				brandsPromise={brands}
				categoriesPromise={categories}
			/>
			{session?.user?.role === "admin"
				? <AdminPanel className="ml-4" />
				: null
			}
			<CartStatus
				className="ml-auto"
				getProducts={getProductsByIdsAction}
			/>
			<Auth className="ml-8" />
		</header>
	)
}
