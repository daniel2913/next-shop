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
import OrderMenu from "../UI/Order"

export default async function Navbar() {
	const [brands, categories] = await Promise.all([BrandCache.get(), CategoryCache.get()])
	return (
		<>

			<Link href="/shop/home" className="basis-0 justify-center md:text-2xl flex-auto flex items-center flex-col md:flex-row font-semibold md:gap-2">
				<Home width={"30px"} height={"30px"} />
				Home
			</Link>

			<CartStatus
				className="flex-auto font-semibold md:text-2xl justify-center basis-0"
			/>

			<SearchContainer className="flex-auto font-semibold justify-center basis:0 md:px-4 md:basis-80">
				<Search
					className="h-full font-semibold"
					allBrands={brands}
					allCategories={categories}
				/>
			</SearchContainer>

			<OrderMenu className="flex-auto font-semibold md:text-2xl justify-center basis-0"/>
			<AuthContainer className="flex-auto md:text-2xl font-semibold justify-center basis-0">
				<Auth className="" />
			</AuthContainer>
		</>
	)
}
