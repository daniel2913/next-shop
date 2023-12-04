"use client"
import type { Brand, Category } from "@/lib/DAL/Models"
import { useRouter } from "next/navigation"
import React from "react"

interface Props {
	className?: string
	brandList: Brand[]
	categoryList: Category[]
}

export default function Search({
	className,
	brandList,
	categoryList,
}: Props) {
	const router = useRouter()
	const [queryString, setQueryString] =
		React.useState<string>("")

	const [brands, setBrands] = React.useState<
		{ brand: Brand; checked: boolean }[]
	>(brandList.map((brand) => ({ brand, checked: false })))
	const [categories, setCategories] = React.useState<
		{ category: Category; checked: boolean }[]
	>(
		categoryList.map((category) => ({
			category,
			checked: false,
		}))
	)

	async function onClick() {
		const query = new URL("shop", "http://localhost:3000")
		const queryCats = categories.filter(
			(category) => category.checked
		)
		const queryBrands = brands.filter((brand) => brand.checked)
		if (queryString) query.searchParams.set("name", queryString)
		if (queryCats.length)
			query.searchParams.set(
				"category",
				encodeURIComponent(
					queryCats.map((cat) => cat.category.name).join(",")
				)
			)
		if (queryBrands.length)
			query.searchParams.set(
				"brand",
				encodeURIComponent(
					queryBrands.map((brand) => brand.brand.name).join(",")
				)
			)
		router.push(query.toString())
	}
	function onBrandCheck(name: string) {
		setBrands(
			brands.map((brand) => ({
				...brand,
				checked:
					name === brand.brand.name
						? !brand.checked
						: brand.checked,
			}))
		)
	}

	function onCategoryCheck(name: string) {
		setCategories(
			categories.map((category) => ({
				...category,
				checked:
					name === category.category.name
						? !category.checked
						: category.checked,
			}))
		)
	}
	return (
		<div
			className={`${className} group relative right-auto flex w-1/2`}
		>
			<div className="w-full">
				<input
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
				className="
                absolute top-6 hidden 
                w-full overflow-x-scroll group-focus-within:block
                "
			>
				<div className="z-50 flex gap-3">
					{categories.map((category) => {
						return (
							<div key={`category ${category.category.name}`}>
								<input
									type="checkbox"
									id={category.category.name}
									name={category.category.name}
									checked={category.checked}
									onChange={() =>
										onCategoryCheck(category.category.name)
									}
								/>
								<label htmlFor={category.category.name}>
									{category.category.name}
								</label>
							</div>
						)
					})}
				</div>
				<br />
				<div className="z-50 flex gap-3">
					{brands.map((brand) => {
						return (
							<div key={`brand ${brand.brand.name}`}>
								<input
									type="checkbox"
									id={brand.brand.name}
									name={brand.brand.name}
									checked={brand.checked}
									onChange={() => onBrandCheck(brand.brand.name)}
								/>
								<label htmlFor={brand.brand.name}>
									{brand.brand.name}
								</label>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
