import React from "react"
import CartStatus from "@/components/cart/Status"
import Link from "next/link"
import Home from "@public/home.svg"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters"
import Search from "./search/Search"
import SearchContainer from "./search/SearchContainer"
import OrderMenu from "./Orders"
import AuthContainer from "./auth/AuthContainer"
import Auth from "./auth/Auth"
import NavButton from "./Navbutton"
import { Axis3D } from "lucide-react"

export default async function Navbar() {
	const [brands, categories] = await Promise.all([BrandCache.get(), CategoryCache.get()])
	return (
		<>
				<NavButton
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center"
				>
				<Link href="/shop/home" 
				className=" absolute size-full inset-0 basis-0" 
				/>
				<Home className="*:stroke-foreground *:fill-foreground" width={"30px"} height={"30px"} />
				Home
				</NavButton>
			<SearchContainer 
				className="basis-0 md:basis-1/4 flex-auto font-semibold md:text-2xl justify-center"
			>
				<Search
					className="h-full font-semibold"
					allBrands={brands}
					allCategories={categories}
				/>
			</SearchContainer>

			<CartStatus
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center"
			/>


			<OrderMenu 
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center "
			/>
			<AuthContainer 
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center "
			>
				<Auth className="" />
			</AuthContainer>
		</>
	)
}
