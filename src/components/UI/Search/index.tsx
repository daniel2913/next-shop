"use client"
import type { Brand, Category } from "@/lib/DAL/Models"
import { useRouter } from "next/navigation"
import React from "react"
import CheckBoxBlock from "../CheckBoxBlock"
import { Button } from "@/components/material-tailwind"
import SearchIcon from "@/../public/search.svg"

interface Props {
	className?: string
	brandList: Brand[]
	categoryList: Category[]
}

export default function Search({ className, brandList, categoryList }: Props) {
	const router = useRouter()
	const [queryString, setQueryString] = React.useState<string>("")

	const brandImages = brandList.map((brand) => `/brands/${brand.image}`)
	const categoryImages = categoryList.map((cat) =>`/categories/${cat.image}`)

	const [brands, setBrands] = React.useState<string[]>([])
	const [categories, setCategories] = React.useState<string[]>([])

	async function onClick() {
		const query = new URL("shop", "http://localhost:3000")
		if (queryString) query.searchParams.set("name", queryString)
		if (categories.length)
			query.searchParams.set(
				"category",
				encodeURIComponent(categories.join(","))
			)
		if (brands.length)
			query.searchParams.set(
				"brand",
				encodeURIComponent(brands.join(","))
			)
		router.push(query.toString())
	}

	return (
		<div className={`${className} group relative right-auto flex w-1/2`}>
			<div className="flex w-full">
				<input
					autoComplete="off"
					className="
            w-4/5 rounded-l-lg border-2 border-r-0 h-full
          	border-cyan-600 border-r-transparent bg-cyan-100 px-2
          "
					type="search"
					name="searchQuery"
					id="searchQuery"
					value={queryString}
					onChange={(e) => setQueryString(e.currentTarget.value)}
				/>
				<Button
					className="
            rounded-r-lg rounded-l-none h-full
						border-cyan-600 border-2 border-l-0
						text-center p-0 border-l-transparent
						bg-accent1-400 text-teal-400 text-md
						hover:!shadow-none shadow-none
						px-1
          "
					type="button"
					onClick={onClick}
				>
					<SearchIcon width="25px" height="25px"/>
				</Button>
			</div>
			<div
				tabIndex={0}
				className="
        	absolute top-8 rounded-lg z-30 hidden w-full
          overflow-x-hidden bg-accent2-300 group-focus-within:block
        "
			>
				<CheckBoxBlock
					id = "category"
					className="flex overflow-x-scroll w-full"
					value={categories}
					options={categoryList.map(cat=>cat.name)}
					setValue={setCategories}
					view="images"
					images={categoryImages}
				/>
				<CheckBoxBlock
					id="brand"
					className="flex overflow-x-scroll w-full"
					value={brands}
					options={brandList.map(brand=>brand.name)}
					setValue={setBrands}
					view="images"
					images={brandImages}
				/>
			</div>
		</div>
	)
}
