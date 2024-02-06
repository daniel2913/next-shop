"use client"
import { useRouter } from "next/navigation"
import React, { FormEvent } from "react"
import { Button } from "@/components/UI/button"
import SearchIcon from "@/../public/search.svg"
import useProductStore from "@/store/productsStore/productStore"
import Input from "../Input"
import { ToggleGroup} from "../toggle-group"

type Props = {
	className?: string
	categoryItems:React.ReactNode[]
	brandItems:React.ReactNode[]
}

export default function Search({ className, brandItems,categoryItems}: Props) {
	const [brands,setBrands] = React.useState<string[]>([])
	const [categories, setCategories] = React.useState<string[]>([])
	const [name,setName] = React.useState("")
	const router = useRouter()
	async function onSubmit(e:FormEvent) {
		console.log([...(new FormData(e.currentTarget)).entries()])
		e.preventDefault()
		const query = new URL("/shop", "http://localhost:3000")
		if (name) query.searchParams.set("name", name)
		console.log(categories)
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
		useProductStore.setState({products:[]})
		router.push(query.toString())
		router.refresh()
	}

	return (
			<form
				onSubmit={onSubmit}
				className={`
				${className} group relative right-auto flex w-full
				flex overflow-hidden
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
					value={name}
					name="name"
					onChange={(e) => setName(e.currentTarget.value)}
				/>
				<Button
					className="
            rounded-r-lg rounded-l-none h-full
						text-center p-0 w-12 flex-grow-0
						bg-accent1-400 text-teal-400 text-md
						px-1
          "
					type="submit"
				>
					<SearchIcon width="25px" height="25px" />
				</Button>
				<ToggleGroup
					type="multiple"
					variant="outline"
					value={categories}
					onValueChange={(str:string[])=>setCategories(str)}
				>
					{categoryItems}
				</ToggleGroup>
				<ToggleGroup
					type="multiple"
					variant="outline"
					value={brands}
					onValueChange={(str:string[])=>setBrands(str)}
				>
					{brandItems}
				</ToggleGroup>
			</form>
	)
}
