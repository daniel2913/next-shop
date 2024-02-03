"use client"
import type { Brand, Category } from "@/lib/DAL/Models"
import { useRouter } from "next/navigation"
import React from "react"
import CheckBoxBlock from "../CheckBoxBlock"
import { Button } from "@/components/UI/button"
import SearchIcon from "@/../public/search.svg"
import useProductStore from "@/store/productsStore/productStore"
import Input from "../Input"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"

interface Props {
	className?: string
	brandsPromise: Promise<Brand[]>
	categoriesPromise: Promise<Category[]>
}

export default function Search({ className, brandsPromise, categoriesPromise }: Props) {
	const router = useRouter()
	const brandList = React.use(brandsPromise)
	const categoryList = React.use(categoriesPromise)
	const [queryString, setQueryString] = React.useState<string>("")
	const clearProducts = useProductStore(state => state.clearProducts)
	const brandImages = brandList.map((brand) => `/brands/${brand.image}`)
	const categoryImages = categoryList.map((cat) => `/categories/${cat.image}`)
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
		clearProducts()
		router.push(query.toString())

	}

	return (
		<Popover>
			<div className={`
				${className} group relative right-auto flex w-1/2
				flex overflow-hidden
				focus-within:w-[30rem] transition-[width] w-40
				border-2 rounded-lg border-cyan-400"
			`}>
				<Input
					autoComplete="off"
					className="
						flex-grow
            rounded-l-lg border-none h-full
           	bg-cyan-100 rounded-r-none
						text-black
						font-medium text-2xl
          "
					name="searchQuery"
					id="searchQuery"
					value={queryString}
					onChange={(e) => setQueryString(e.currentTarget.value)}
				/>
				<PopoverTrigger>
					^
				</PopoverTrigger>
				<Button
					className="
            rounded-r-lg rounded-l-none h-full
						text-center p-0 w-12 flex-grow-0
						bg-accent1-400 text-teal-400 text-md
						px-1
          "
					type="button"
					onClick={onClick}
				>
					<SearchIcon width="25px" height="25px" />
				</Button>
			</div>
			<PopoverContent
				tabIndex={0}
				className="
        	absolute top-8 rounded-lg z-30 hidden w-full
          overflow-x-hidden bg-accent2-300 group-focus-within:block
        "
			>
				<CheckBoxBlock
					id="category"
					className="flex overflow-x-scroll w-full"
					value={categories}
					options={categoryList.map(cat => cat.name)}
					setValue={setCategories}
					view="images"
					images={categoryImages}
				/>
				<CheckBoxBlock
					id="brand"
					className="flex overflow-x-scroll w-full"
					value={brands}
					options={brandList.map(brand => brand.name)}
					setValue={setBrands}
					view="images"
					images={brandImages}
				/>
			</PopoverContent>
		</Popover>
	)
}
