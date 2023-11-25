import Link from "next/link"
import React from "react"
import Auth from "../ui/Auth"
import CartStatus from "../cart/Status"
import Search from "../ui/Search"
import { getAllBrands, getAllCategories } from "@/helpers/cachedGeters"

export const revalidate = 300

export default async function NavBar() {
	const [brands, categories] = await Promise.all([
		getAllBrands(),
		getAllCategories(),
	])
	return (
		<header
			className="
            relative top-0 left-0 right-0
            h-12 py-2 px-5
            flex justify-between items-center
            bg-teal-400"
		>
			<div className="w-20 h-full bg-accent1-400" />
			<Search className="h-full" brandList={brands} categoryList={categories} />
			<div className="flex gap-4 items-center">
				<CartStatus />
				<Auth />
			</div>
		</header>
	)
}
