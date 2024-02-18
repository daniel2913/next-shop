"use client"
import React, { FormEvent } from "react"
import { Button } from "@/components/ui/Button"
import SearchIcon from "@/../public/search.svg"
import useProductStore from "@/store/productStore"
import Input from "../../ui/Input"
import Image from "next/image"
import { Brand, Category } from "@/lib/Models"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import useResponsive from "@/hooks/useResponsive"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ScrollArea, ScrollBar } from "../../ui/ScrollArea"

type Props = {
	className?: string
	allBrands: Brand[]
	allCategories: Category[]
}


function deffer<T extends (args: any) => any>(func: T, delay = 5000) {
	let timeout:NodeJS.Timeout
	return function deffered(inst:boolean,...args: Parameters<T>) {
			if (timeout)
				clearTimeout(timeout)
			if (inst)
				func.apply(null,args)		
			else
				timeout = setTimeout(()=>func.apply(null,args),delay)
		}
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
	const [name, setName] = React.useState(params.get("name") || "")
	const mode = useResponsive()

	const navigate = React.useCallback((query:URL)=>{
		if (path === "/shop") {
			history.pushState({query:query.toString()}, "", query.toString())
			useProductStore.getState().navigate(query.searchParams)
		}
		else {
			useProductStore.setState({ products: [], inited: false })
			router.push(query.toString())
		}
	},[router,path])

	const navigateDeff = React.useCallback(deffer(navigate, 1000),[path])

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
		navigateDeff(true,query)
	}
	async function afterChange({nameCur,brandCur,categoryCur}:{nameCur?:string,brandCur?:string[],categoryCur?:string[]}) {
		const query = new URL("/shop", window.location.toString())
		if (name) query.searchParams.set("name", nameCur ?? name)
		for (const category of (categoryCur ?? categories))
			query.searchParams.append(
				"category",
				category
			)
		for (const brand of (brandCur ?? brands))
			query.searchParams.append(
				"brand",
				brand
			)
		navigateDeff(false,query)
	}

	return (
		<form
			onSubmit={onSubmit}
			className={`
				${className} group relative right-auto w-full
				md:border-2 mt-8 md:mt-0 rounded-lg flex flex-col 
			`}>
			<div className="flex border-foreground rounded-lg border-2 items-start p-4 pt-8 md:p-0 md:items-center md:h-full">
				<Input
					autoComplete="off"
					className="
						rounded-none
          	rounded-l-md border-none h-8
          	bg-white text-black rounded-r-none
						text-black p-1 
						font-medium text-2xl
          "
					autoFocus={mode === "mobile"}
					value={name}
					name="name"
					onChange={(e) => {
						setName(e.currentTarget.value)
						afterChange({nameCur:e.currentTarget.value})
					}}
				/>
				<Button
					className="
            rounded-r-md rounded-l-none h-8
						text-center p-0 w-12 flex-grow-0
						bg-secondary text-teal-400 text-md
						px-1 flex justify-center items-center
						hover:bg-secondary/5 border-l-2 border-foreground
          "
					type="submit"
				>
					<SearchIcon className="*:stroke-foreground *:fill-foreground" width="30px" height="30px" />
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
					onValueChange={(str: string[]) => {
						setCategories(str)
						afterChange({categoryCur:str})
					}}
				>
					<span>Category</span>
					<ScrollArea className="h-[30dvh] w-full overflow-x-hidden">
						{
							allCategories.map(category =>
								<ToggleGroupItem className="w-full justify-start flex gap-4" name="category" value={category.name} key={category.name}>
									<div className="size-8 relative object-contain">
										<Image
											alt={category.name}
											src={`/categories/${category.image}`}
											fill
											sizes="40px"
										/>
									</div>
									{category.name}
									<input name="category" hidden readOnly value={category.name} checked={categories.includes(category.name)} />
								</ToggleGroupItem>
							)
						}
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				</ToggleGroup>
				<ToggleGroup
					className="flex flex-col justify-start w-1/2 gap-2"
					type="multiple"
					value={brands}
					onValueChange={(str: string[]) => {
						setBrands(str)
						afterChange({brandCur:str})
					}}
				>
					<span>Brand</span>
					<ScrollArea className="h-[30dvh] w-full overflow-x-hidden">
						{
							allBrands.map(brand =>
								<ToggleGroupItem className="w-full flex gap-4 justify-start" name="brand" value={brand.name} key={brand.name}>
									<div className="size-8 relative object-contain">
										<Image
											alt={brand.name}
											src={`/brands/${brand.image}`}
											fill
											sizes="40px"
										/>
									</div>
									{brand.name}
									<input name="brand" hidden readOnly value={brand.name} checked={brands.includes(brand.name)} />
								</ToggleGroupItem>
							)}
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				</ToggleGroup>
			</div>
		</form>
	)
}
