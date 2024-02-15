"use client"
import React, { FormEvent } from "react"
import { Button } from "@/components/ui/Button"
import SearchIcon from "@/../public/search.svg"
import useProductStore from "@/store/productStore"
import Input from "../../ui/Input"
import Image from "next/image"
import { Brand, Category } from "@/lib/Models"
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/ToggleGroup"
import useResponsive from "@/hooks/useResponsive"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ScrollArea, ScrollBar } from "../../ui/ScrollArea"

type Props = {
	className?: string
	allBrands: Brand[]
	allCategories: Category[]
}

export default function Search({ className, allBrands, allCategories }: Props) {
	const params = useSearchParams()
	const initBrands = params.get("brand")
		? params.getAll("brand")
		: []
	const initCategories = params.get("category")
		? params.getAll("category")
		: []
	const [brands, setBrands] = React.useState<string[]>(initBrands)
	const [categories, setCategories] = React.useState<string[]>(initCategories)
	const router = useRouter()
	const path = usePathname()
	const [name, setName] = React.useState(params.get("name")||"")
	const mode = useResponsive()
	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		const query = new URL("/shop", window.location.toString())
		if (name) query.searchParams.set("name", name)
		for (const category of categories)
			query.searchParams.append(
				"category",
				category
			)
		for (const brand of brands)
			query.searchParams.append(
				"brand",
				brand
			)
		if (path==="/shop"){
			history.pushState({ brands, categories, name }, "", query.toString())
			useProductStore.getState().navigate(query.searchParams)
		}
		else {
			useProductStore.setState({products:[],inited:false})
			router.push(query.toString())	
		}
	}

	return (
			<form
				onSubmit={onSubmit}
				className={`
				${className} group relative right-auto w-full
				md:border-2 mt-8 md:mt-0 rounded-lg flex flex-col 
			`}>
			<div className="flex items-start p-4 pt-8 md:p-0 md:items-center md:h-full">
				<Input
					autoComplete="off"
					className="
						rounded-none
          	rounded-l-md border-none h-8
          	bg-cyan-100 rounded-r-none
						text-black p-1 
						font-medium text-2xl
          "
					autoFocus={mode==="mobile"}
					value={name}
					name="name"
					onChange={(e) => setName(e.currentTarget.value)}
				/>
				<Button
					className="
            rounded-r-md rounded-l-none h-8
						text-center p-0 w-12 flex-grow-0
						bg-primary text-teal-400 text-md
						px-1 flex justify-center items-center
          "
					type="submit"
				>
					<SearchIcon width="30px" height="30px" />
				</Button>
				</div>
				<div className="
					md:absolute left-0 right-0 bottom-full md:bottom-auto md:top-full
					z-[100] bg-secondary border-2 rounded-lg flex md:hidden group-focus-within:flex
					gap-4 p-2
					
				">
					<ToggleGroup
						className="flex flex-col justify-start w-1/2 gap-2"
						type="multiple"
						value={categories}
						onValueChange={(str: string[]) => setCategories(str)}
					>
						<span>Category</span>
						<ScrollArea className="h-[30dvh] overflow-x-hidden">
							{
								allCategories.map(category =>
									<ToggleGroupItem className="w-full flex justify-between" name="category" value={category.name} key={category.name}>
										{category.name}
									<div className="size-8 relative object-contain">
										<Image
											alt={category.name}
											src={`/categories/${category.image}`}
											fill
											sizes="40px"
										/>
									</div>
										<input name="category" hidden readOnly value={category.name} checked={categories.includes(category.name)} />
									</ToggleGroupItem>
								)
							}
							<ScrollBar orientation="vertical"/>
							</ScrollArea>
					</ToggleGroup>
					<ToggleGroup
						className="flex flex-col justify-start w-1/2 gap-2"
						type="multiple"
						value={brands}
						onValueChange={(str: string[]) => setBrands(str)}
					>
						<span>Brand</span>
						<ScrollArea className="h-[30dvh] overflow-x-hidden">
							{
								allBrands.map(brand =>
									<ToggleGroupItem className="w-full flex justify-between" name="brand" value={brand.name} key={brand.name}>
										{brand.name}
									<div className="size-8 relative object-contain">
										<Image
											alt={brand.name}
											src={`/brands/${brand.image}`}
											fill
											sizes="40px"
										/>
										</div>
										<input name="brand" hidden readOnly value={brand.name} checked={brands.includes(brand.name)} />
									</ToggleGroupItem>
								)}
							<ScrollBar orientation="vertical"/>
						</ScrollArea>
					</ToggleGroup>
					</div>
			</form>
	)
}
