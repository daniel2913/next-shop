import React from "react"
import Auth from "../UI/Auth"
import CartStatus from "../cart/Status"
import AuthContainer from "../UI/Auth/container"
import Link from "next/link"
import Catalogue from "@public/journal.svg"
import Home from "@public/home.svg"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import Search from "../UI/Search"
import SearchContainer from "../UI/Search/container"

export default async function Navbar() {
	const [brands, categories] = await Promise.all([BrandCache.get(), CategoryCache.get()])
	return (
		<>

			<Link href="./" className="basis-0 flex-auto flex items-center flex-col sm:flex-row">
				<Home width={"30px"} height={"30px"} />
				Home
			</Link>

			<Link href="./" className="basis-0 flex-auto items-center flex flex-col sm:flex-row">
				<Catalogue width={"30px"} height={"30px"} />
				Catalogue
			</Link>

			<SearchContainer className="flex-auto basis-0">
				<Search
					className="h-full"
					allBrands={brands}
					allCategories={categories}
				/>
			</SearchContainer>
			<CartStatus
				className="flex-auto basis-0"
			/>
			<AuthContainer className="flex-auto basis-0">
				<Auth className="" />
			</AuthContainer>
		</>
	)
}
