import React from "react"
import CartStatus from "@/components/cart/Status"
import Link from "next/link"
import Home from "@public/home.svg"
import Catalogue from "@public/catalogue.svg"
import { BrandCache, CategoryCache } from "@/helpers/cache"
import Search from "./search/Search"
import SearchContainer from "./search/SearchContainer"
import AuthContainer from "./auth/AuthContainer"
import Auth from "./auth/Auth"
import NavButton from "../ui/Navbutton"

export default async function Navbar() {
	const [brands, categories] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
	])
	return (
		<>
			<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
				<Link
					href="/shop/home"
					className=" absolute inset-0 size-full basis-0"
				/>
				<Home
					className="*:fill-foreground *:stroke-transparent"
					width={"30px"}
					height={"30px"}
				/>
				Home
			</NavButton>
			<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
				<Link
					href="/shop"
					className=" absolute inset-0 size-full basis-0"
				/>
				<Catalogue
					className="*:fill-foreground *:stroke-foreground"
					width={"30px"}
					height={"30px"}
				/>
				Catalogue
			</NavButton>
			<SearchContainer className="flex-auto basis-0 justify-center font-semibold md:basis-1/4 md:text-2xl">
				<Search
					className="h-full font-semibold"
					allBrands={brands}
					allCategories={categories}
				/>
			</SearchContainer>
			<CartStatus className=" flex-auto basis-0 justify-center font-semibold md:text-2xl" />
			<AuthContainer className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
				<Auth className="" />
			</AuthContainer>
		</>
	)
}
