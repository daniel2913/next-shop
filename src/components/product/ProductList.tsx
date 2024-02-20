"use client"
import useInfScroll, {useAuthReload, useItems, useSearchReload } from "@/hooks/useInfScroll"
import type { PopulatedProduct } from "@/lib/Models/Product"
import React from "react"
import ProductCard from "./ProductCard"
import Loading from "../ui/Loading"
import { getProductsByIdsAction } from "@/actions/product"
import { getProductsPageAction } from "@/actions/product"

type Props = {
	products: PopulatedProduct[]
}

export async function queryProducts(query: URLSearchParams, skip?: number, page?: number) {
	const res = await getProductsPageAction({
		skip,
		page,
		brand: query.getAll("brand"),
		category: query.getAll("category"),
		name: query.get("name") || undefined
	})
	return res
}

export default function ProductList({ products: initProducts }: Props) {
	const endRef = React.useRef<HTMLDivElement>(null)
	const {
		items:products,
		updateOne,
		reloadOne,
		loading,
		reload,
		setLoading,
		setItems:setProducts} = 
		useItems({initItems:initProducts,page:10,getItems:getProductsByIdsAction})

	const loadMore = React.useCallback(async (query:URLSearchParams,skip:number,page=10)=>{
		const newProducts = await queryProducts(query,skip,page)
		if ("error" in newProducts) return 0
		if (newProducts && newProducts.length)
			setProducts(old=>[...old,...newProducts])
		return newProducts ? newProducts.length  : 0
	},[setProducts])

	useInfScroll(products,loadMore,endRef,10)
	useSearchReload({query:queryProducts, setItems:setProducts,setLoading})
	useAuthReload(reload)
	const initedProducts = products || initProducts
	return (
		<>
		<Loading loading={loading}>
			{initedProducts.map((product) => (
				<ProductCard
					key={`${product.id}`}
					{...product}
					reload={reloadOne}
					update={updateOne}
				/>
			))}
		</Loading>
			<div
				className="relative bottom-96 invisible"
				ref={endRef}
			>
				...
			</div>
		</>
	)
}
