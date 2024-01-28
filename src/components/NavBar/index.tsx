import React, { Suspense } from "react"
import Auth from "../ui/Auth"
import CartStatus from "../cart/Status"
import Search from "../ui/Search"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import { getProductsByIdsAction } from "@/actions/product"
import OrderList from "../cart/Orders"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminPanel from "../admin/AdminPanel"


export default async function NavBar() {
	const session = await getServerSession(authOptions)
	const [brands, categories] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
	])

	return (
		<header
			className="
            relative left-0 right-0 top-0
            flex h-12 items-center
            justify-between bg-teal-400 px-5
            py-2"
		>
			<div className="h-full w-20 bg-accent1-400" />
			<Search
				className="h-full"
				brandList={brands}
				categoryList={categories}
			/>
			<div className="flex items-center gap-4">
				{session?.user?.role==="admin"
					?<AdminPanel/>
					:null
				}
				<CartStatus 
					getProducts={getProductsByIdsAction}
					orders={
						<Suspense>
							<OrderList completed={false}/>
						</Suspense>}
				/>
				<Auth />
			</div>
		</header>
	)
}
