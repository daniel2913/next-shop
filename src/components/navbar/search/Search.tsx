"use client"
import React, { FormEvent } from "react"
import { Brand, Category } from "@/lib/Models"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { deffer } from "@/helpers/misc"
import { cn } from "@/helpers/utils"
import { SearchInput } from "./SearchInput"
import { CategoryFilter, BrandFilter } from "./Filters"

type Props = {
	className?: string
	allBrands: Brand[]
	allCategories: Category[]
}

export default function Search({ className, allBrands, allCategories }: Props) {
	const params = useSearchParams()
	const initBrands = params.get("brand") ? params.getAll("brand") : []
	const initCategories = params.get("category") ? params.getAll("category") : []
	const [brands, setBrands] = React.useState<string[]>(initBrands)
	const [categories, setCategories] = React.useState<string[]>(initCategories)
	const router = useRouter()
	const path = usePathname()
	const [name, setName] = React.useState(params.get("name") || "")

	const navigate = React.useCallback(
		(query: URL) => {
			if (path === "/shop") {
				history.pushState({ query: query.toString() }, "", query.toString())
			} else {
				router.push(query.toString())
			}
		},
		[router, path]
	)

	const navigateDeff = React.useCallback(deffer(navigate, 500), [path])

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		const query = new URL("/shop", window.location.toString())
		if (name) query.searchParams.set("name", name)
		for (const category of categories)
			query.searchParams.append("category", category)
		for (const brand of brands) query.searchParams.append("brand", brand)
		navigateDeff(true, query)
	}
	async function afterChange({
		nameCur,
		brandCur,
		categoryCur,
	}: {
		nameCur?: string
		brandCur?: string[]
		categoryCur?: string[]
	}) {
		const query = new URL("/shop", window.location.toString())
		if (name) query.searchParams.set("name", nameCur ?? name)
		for (const category of categoryCur ?? categories)
			query.searchParams.append("category", category)
		for (const brand of brandCur ?? brands)
			query.searchParams.append("brand", brand)
		navigateDeff(false, query)
	}

	return (
		<form
			onSubmit={onSubmit}
			className={cn(
				className,
				"group relative right-auto mt-8 flex w-full flex-col rounded-lg md:mt-0 md:border-2"
			)}
		>
			<SearchInput
				name={name}
				setName={setName}
				afterChange={afterChange}
			/>
			<div className="bottom-full left-0 right-0 z-[100] flex gap-4 rounded-lg border-2 bg-secondary p-2 group-focus-within:flex md:absolute md:bottom-auto md:top-full md:hidden">
				<CategoryFilter
					allCategories={allCategories}
					categories={categories}
					setCategories={setCategories}
					afterChange={afterChange}
				/>
				<BrandFilter
					allBrands={allBrands}
					brands={brands}
					setBrands={setBrands}
					afterChange={afterChange}
				/>
			</div>
		</form>
	)
}
