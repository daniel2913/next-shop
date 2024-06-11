import React from "react";
import CartStatus from "@/components/cart/Status";
import Link from "next/link";
import Home from "@public/home.svg";
import Catalogue from "@public/catalogue.svg";
import { BrandCache, CategoryCache } from "@/helpers/cache";
import Search from "./search/Search";
import SearchContainer from "./search/SearchContainer";
import AuthContainer from "./auth/AuthContainer";
import Auth from "./auth/Auth";
import NavButton from "../ui/Navbutton";

export default async function Navbar() {
	const [brands, categories] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
	]);
	return (
		<>
			<NavButton tabIndex={-1} className=" me-8 justify-center font-semibold md:text-xl">
				<Link
					href="/shop/home"
					aria-label="go to home page"
					className=" absolute inset-0 size-full basis-0"
				/>
				<Home
					tabIndex={-1}
					className="*:fill-foreground *:stroke-transparent"
					width={"20px"}
					height={"20px"}
				/>
				Home
			</NavButton>
			<NavButton tabIndex={-1} className="me-8 justify-center font-semibold md:text-xl">
				<Link
					href="/shop"
					aria-label="go to catalogue page"
					className=" absolute inset-0 size-full basis-0"
				/>
				<Catalogue
					tabIndex={-1}
					className="*:fill-foreground *:stroke-foreground"
					width={"20px"}
					height={"20px"}
				/>
				Catalogue
			</NavButton>
			<SearchContainer className="justify-center font-semibold flex-shrink-0 md:basis-2/5 md:text-xl">
				<Search
					className="h-full font-semibold"
					allBrands={brands}
					allCategories={categories}
				/>
			</SearchContainer>
			<CartStatus className="ms-8 justify-center font-semibold md:text-xl" />
			<AuthContainer className=" ms-8 justify-center font-semibold md:text-xl">
				<Auth className="" />
			</AuthContainer>
		</>
	);
}
