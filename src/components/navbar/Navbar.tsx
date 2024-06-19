import React from "react";
import CartStatus from "@/components/cart/Status";
import Link from "next/link";
import Home from "@public/home.svg";
import List from "@public/catalogue.svg";
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
			<NavButton tabIndex={-1} className="md:ms-auto md:me-8 md:flex-grow-0 justify-center flex-auto basis-1/5 md:basis-0 font-semibold md:text-xl">
				<Link
					href="/shop/home"
					aria-label="go to home page"
					className=" absolute inset-0 size-full flex-auto basis-1/5 md:basis-0"
				/>
				<Home
					tabIndex={-1}
					className="*:fill-foreground *:stroke-transparent"
					width={"20px"}
					height={"20px"}
				/>
				Home
			</NavButton>
			<NavButton tabIndex={-1} className="md:flex-grow-0 md:me-8 justify-center flex-auto basis-1/5 md:basis-0 font-semibold md:text-xl">
				<Link
					href="/shop"
					aria-label="go to product list page"
					className=" absolute inset-0 size-full flex-auto basis-1/5 md:basis-0"
				/>
				<List
					tabIndex={-1}
					className="*:fill-foreground *:stroke-foreground"
					width={"20px"}
					height={"20px"}
				/>
				List
			</NavButton>
			<SearchContainer className="justify-center font-semibold md:flex-shrink-0 basis-1/5 md:basis-2/5 md:text-xl">
				<Search
					className="h-full font-semibold"
					allBrands={brands}
					allCategories={categories}
				/>
			</SearchContainer>
			<CartStatus className="md:flex-grow-0 md:ms-8 justify-center flex-auto basis-1/5 md:basis-0 font-semibold md:text-xl" />
			<AuthContainer className=" md:me-auto md:ms-8 md:flex-grow-0 justify-center font-semibold basis-1/5 md:basis-0 text-nowrap md:text-xl">
				<Auth className="" />
			</AuthContainer>
		</>
	);
}
