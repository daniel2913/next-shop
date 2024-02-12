"use client"
import React, { FormEvent } from "react"
import { Button } from "@/components/UI/button"
import SearchIcon from "@/../public/search.svg"
import useProductStore from "@/store/productsStore/productStore"
import Input from "../Input"
import { ToggleGroup, ToggleGroupItem } from "../toggle-group"
import Image from "next/image"
import { Brand, Category } from "@/lib/DAL/Models"
import useResponsive from "@/hooks/useWidth"
import { usePathname, useRouter } from "next/navigation"

type Props = {
	className?: string
	allBrands: Brand[]
	allCategories: Category[]
}

export default function Search({ className, allBrands, allCategories }: Props) {
	const [brands, setBrands] = React.useState<string[]>([])
	const router = useRouter()
	const path = usePathname()
	const [categories, setCategories] = React.useState<string[]>([])
	const [name, setName] = React.useState("")
	const mode = useResponsive()
	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		const query = new URL("/shop", "http://localhost:3000")
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
				sm:border-2 mt-8 sm:mt-0 rounded-lg flex flex-col 
			`}>
			<div className="flex items-start p-4 pt-8 sm:p-0 sm:items-center sm:h-full">
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
					sm:absolute left-0 right-0 bottom-full sm:bottom-auto sm:top-full
					z-[100] bg-secondary border-2 rounded-lg sm:hidden sm:group-focus-within:block
					
				">
					<ToggleGroup
						type="multiple"
						value={categories}
						onValueChange={(str: string[]) => setCategories(str)}
					>
							{
								allCategories.map(category =>
									<ToggleGroupItem className="w-12" name="category" value={category.name} key={category.name}>
										<Image
											alt={category.name}
											src={`/categories/${category.image}`}
											height={60}
											width={60}
										/>
										<input name="category" hidden readOnly value={category.name} checked={categories.includes(category.name)} />
									</ToggleGroupItem>
								)
							}
					</ToggleGroup>
					<ToggleGroup
						type="multiple"
						value={brands}
						onValueChange={(str: string[]) => setBrands(str)}
					>
							{
								allBrands.map(brand =>
									<ToggleGroupItem className="w-12" name="brand" value={brand.name} key={brand.name}>
										<Image
											alt={brand.name}
											src={`/brands/${brand.image}`}
											height={60}
											width={60}
										/>
										<input name="brand" hidden readOnly value={brand.name} checked={brands.includes(brand.name)} />
									</ToggleGroupItem>
								)}
					</ToggleGroup>
					</div>
			</form>
	)
}
