"use client";
import React, { type FormEvent } from "react";
import type { Brand, Category } from "@/lib/Models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deffer } from "@/helpers/misc";
import { SearchInput } from "./SearchInput";
import { CategoryFilter, BrandFilter } from "./Filters";

type Props = {
	className?: string;
	allBrands: Brand[];
	allCategories: Category[];
};

function navigate(query: URL, path: string, go: (query: string) => void) {
	if (path === "/shop") {
		history.pushState({ query: query.toString() }, "", query.toString());
	} else {
		go(query.toString());
	}
}
const navigateDeff = deffer(navigate, 500);

export default function Search({ className, allBrands, allCategories }: Props) {
	const params = useSearchParams();
	const router = useRouter();
	const path = usePathname();
	const [brands, setBrands] = React.useState(params.getAll("brand"));
	const [categories, setCategories] = React.useState(params.getAll("category"));
	const [name, setName] = React.useState(params.get("name") || "");

	async function submitHandler(
		{
			nameCur,
			brandCur,
			categoryCur,
		}: {
			nameCur?: string;
			brandCur?: string[];
			categoryCur?: string[];
		},
		e?: FormEvent,
	) {
		e?.preventDefault();
		const query = new URL("/shop", window.location.toString());
		if (name) query.searchParams.set("name", nameCur ?? name);
		for (const category of categoryCur ?? categories)
			query.searchParams.append("category", category);
		for (const brand of brandCur ?? brands)
			query.searchParams.append("brand", brand);
		navigateDeff(!!e, query, path, router.push);
	}

	return (
		<form
			onSubmit={(e) => submitHandler({}, e)}
			className={`group relative right-auto mt-8 flex w-full flex-col rounded-lg md:mt-0 md:border-2 ${className}`}
		>
			<SearchInput name={name} setName={setName} afterChange={submitHandler} />
			<div className="bottom-full left-0 right-0 z-[100] flex gap-4 rounded-lg border-2 bg-secondary p-2 group-focus-within:flex md:absolute md:bottom-auto md:top-full md:hidden">
				<CategoryFilter
					allCategories={allCategories}
					categories={categories}
					setCategories={setCategories}
					afterChange={submitHandler}
				/>
				<BrandFilter
					allBrands={allBrands}
					brands={brands}
					setBrands={setBrands}
					afterChange={submitHandler}
				/>
			</div>
		</form>
	);
}
