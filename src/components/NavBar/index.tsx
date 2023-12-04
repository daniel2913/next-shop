import React from "react"
import Auth from "../ui/Auth"
import CartStatus from "../cart/Status"
import Search from "../ui/Search"
import {
	BrandCache,
	CategoryCache,
} from "@/helpers/cachedGeters"
import { getProducts } from "@/actions/getProducts"
import Link from "next/link"

export const revalidate = 300

interface Props {}

export default async function NavBar({}: Props) {
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
			<Link href="/admin/orders">Orders</Link>
			<div className="h-full w-20 bg-accent1-400" />
			<Search
				className="h-full"
				brandList={brands}
				categoryList={categories}
			/>
			<div className="flex items-center gap-4">
				<CartStatus getProducts={getProducts} />
				<Auth />
			</div>
		</header>
	)
}
