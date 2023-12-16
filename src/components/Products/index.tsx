"use client"
import ProductCard from "@/components/product/ProductCard"
import type { PopulatedProduct } from "@/lib/DAL/Models/Product"
import useProductStore, { ProductProvider, useHydrate } from "@/store/productsStore/productStore"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
type Props = {
	products: PopulatedProduct[]
}


function useInfScroll<T extends any>(
	items:Record<number,T>,
	loadItems:(page:number|undefined,query:string|undefined)=>Promise<false|number>,
	endRef:React.RefObject<HTMLDivElement>,
	page:number = 10,
	searchParams:string|null
){
	const hasMore = React.useRef(true)
	const nextObserver = React.useRef<IntersectionObserver|null>(null)
	if (typeof window !== "undefined"){
		nextObserver.current = new IntersectionObserver(async (entries)=>{
			if (!hasMore.current) return false
			if (!entries[0].isIntersecting) return false
			const newItemsAmount = await loadItems(page,searchParams)
			if (!newItemsAmount || newItemsAmount<page) hasMore.current = false
		})
	}
	
	React.useEffect(()=>{
		if (endRef.current && nextObserver.current){
			nextObserver.current.observe(endRef.current)
		}
	},[endRef])
	return Object.values(items)
}

function keyCompare(oldObj:PopulatedProduct[],newObj:PopulatedProduct[]){
	const oldIds = oldObj.map(obj=>obj.id)
	const newIds = newObj.map(obj=>obj.id)
	return oldIds.toString() === newIds.toString()
}

function useSearch(){
	const router = useRouter()
	React.useEffect(()=>{
			
	},[router])
}


export default function ProductList({products:initProducts}:Props){
	let search = React.useRef<null|string>(null)
	const router = useRouter()
	if (typeof window !== "undefined"){
		//eslint-disable-next-line
		React.useEffect(()=>{
			search.current = window.location.search.slice(1)
		},[router])
	}

	
	
	const endRef = React.useRef<HTMLDivElement>(null)
	let storeProducts = useProductStore(state=>state.products,keyCompare)
	
	const loadProducts = useProductStore(state=>state.loadProducts)
	const scrollProducts = useInfScroll(
		storeProducts,
		loadProducts,
		endRef,
		10,
		search.current
	)

	const products = scrollProducts || initProducts
	
	return (
		<div className="bg-green-100">
			<button onClick={()=>console.log(storeProducts)}>TEST</button>
			<div className="">
				<div className="" />
				<div className="" />
			</div>
			<div
				className="
					grid
					h-full p-5 sm:grid-cols-2
					md:grid-cols-3 lg:grid-cols-4
				"
			>
				{products.map((product) => (
					<ProductCard
						className="h-80 w-64 p-2"
						key={`${product.id}`}
						product = {product}
					/>
				))}
				<div 
					className="bg-accent1-300"
					ref={endRef}
				>
					I KNOW WHERE YOU ARE
				</div>
			</div>
		</div>
	)
}
