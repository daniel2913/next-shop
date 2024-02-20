"use client"
import useInfScroll, { useAuthReload, useItems } from "@/hooks/useInfScroll"
import type { PopulatedProduct } from "@/lib/Models/Product"
import React from "react"
import ProductCard from "./ProductCard"
import Loading from "../ui/Loading"
import { getProductsByIdsAction } from "@/actions/product"
import useToast from "@/hooks/modals/useToast"
import { useRouter } from "next/navigation"

type Props = {
	products: PopulatedProduct[]
	saved:number[]
}

export default function SavedList({ products: initProducts,saved}: Props) {
	const endRef = React.useRef<HTMLDivElement>(null)
	const {items:products,updateOne,reloadOne,loading,setItems:setProducts} = useItems({initItems:initProducts,page:10,getItems:getProductsByIdsAction})
	const {handleResponse} = useToast()

	const loadMore = React.useCallback(async (query:URLSearchParams,skip:number,page=10)=>{
		const newProducts = await getProductsByIdsAction(saved.slice(skip,skip+page))
		if (!handleResponse(newProducts)) return 0
		if (newProducts && newProducts.length)
			setProducts(old=>[...old,...newProducts])
		return newProducts ? newProducts.length  : 0
	},[setProducts])
	const router = useRouter()
	useInfScroll(products,loadMore,endRef,10)
	useAuthReload(()=>router.refresh(),{onUnAuth:()=>router.push("/shop/home")})
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
