"use client"
import type { Brand, Category } from "@/lib/DAL/Models"
import { useRouter } from "next/navigation"
import React from "react"
import CheckBoxBlock from "../CheckBoxBlock"

interface Props {
	className?: string
	brandList: Brand[]
	categoryList: Category[]
}

export default function Search({ className, brandList, categoryList }: Props) {
	const router = useRouter()
	const [queryString, setQueryString] = React.useState<string>("")

	const brandsInit = brandList.reduce((record, brand) =>
		Object.assign(
			record,
			{[brand.name]:{
				value:false,
				image:`/brands/${brand.image}`
			}}
		),
		{} as Record<string,{value:boolean,image:string}>
	)
	const categoriesInit = categoryList.reduce((record, category) =>
		Object.assign(
			record,
			{[category.name]:{
				value:false,
				image:`/categories/${category.image}`
			}}
		),
		{} as Record<string,{value:boolean,image:string}>
	)

	const [brands, setBrands] = React.useState(brandsInit)
	const [categories, setCategories] = React.useState(categoriesInit)

	async function onClick() {
		const query = new URL("shop", "http://localhost:3000")
		const queryCats = Object.keys(categories)
			.filter(key => categories[key].value)
		const queryBrands = Object.keys(brands)
			.filter(key => brands[key].value)
		if (queryString) query.searchParams.set("name", queryString)
		if (queryCats.length)
			query.searchParams.set(
				"category",
				encodeURIComponent(queryCats.join(","))
			)
		if (queryBrands.length)
			query.searchParams.set(
				"brand",
				encodeURIComponent(queryBrands.join(","))
			)
		router.push(query.toString())
	}
	
	function onCheck(setter:typeof setBrands){
		return (name:string)=>
			setter(prev => ({
				...prev,[name]:{...prev[name],value:!prev[name].value}
			}))
	}

	return (
		<div className={`${className} group relative right-auto flex w-1/2`}>
			<div className="w-full">
				<input
					autoComplete="off"
					className="
            w-4/5 rounded-l-lg border-2 border-r-0
          	border-cyan-500 border-r-transparent bg-cyan-100 px-2
          "
					type="search"
					name="searchQuery"
					id="searchQuery"
					value={queryString}
					onChange={(e) => setQueryString(e.currentTarget.value)}
				/>
				<button
					className="
            w-1/5 rounded-r-lg 
            border-2 border-cyan-600
          "
					type="button"
					onClick={onClick}
				>
					Search
				</button>
			</div>
			<div
				tabIndex={0}
				className="
        	absolute top-6 z-30 hidden w-full
          overflow-x-hidden bg-accent2-300 group-focus-within:block
        "
			>
				<CheckBoxBlock
					className="flex overflow-x-scroll w-full"
					value={categories}
					setValue={onCheck(setCategories)}
					type="images"
				/>
				<CheckBoxBlock
					className="flex overflow-x-scroll w-full"
					value={brands}
					setValue={onCheck(setBrands)}
					type="images"
				/>
			</div>
		</div>
	)
}
