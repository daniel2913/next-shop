"use client"
import ProductCard from "@/components/product/ProductCard"
import type { PopulatedProduct } from "@/lib/DAL/Models/Product"
import useProductStore from "@/store/productsStore/productStore"
import React from "react"
type Props = {
	initProducts: PopulatedProduct[]
}


function useInfScroll<T extends any>(
	items:Record<number,T>,
	loadItems:(page:number|undefined,query:string|undefined)=>Promise<false|number>,
	endRef:React.RefObject<HTMLDivElement>,
	page:number = 20,
	searchParams:string|undefined
){
	const hasMore = React.useRef(true)
	const nextObserver = React.useRef<IntersectionObserver|null>(null)
		try{
			nextObserver.current = new IntersectionObserver(async (entries)=>{
			if (!hasMore.current) return false
			if (!entries[0].isIntersecting) return false
			const newItemsAmount = await loadItems(page,searchParams)
			if (!newItemsAmount || newItemsAmount<page) hasMore.current = false
		})
	}
	catch{
		"We Are On The Server!!!"
	}
	
	React.useEffect(()=>{
		if (endRef.current && nextObserver.current){
			nextObserver.current.observe(endRef.current)
		}
	},[endRef])
	return Object.values(items)
}

function keyCompare(oldObj:Record<number,any>,newObj:Record<number,any>){
	return (Object.keys(oldObj).toString() === Object.keys(newObj).toString())
}


export default function ProductList({initProducts}:Props){
	let search = undefined
	try{	if (window)
		search = window.location.search.slice(1)
	}
	catch{
		search = undefined
	}
	const endRef = React.useRef<HTMLDivElement>(null)
	
	const storeProducts = useProductStore(state=>state.products,keyCompare)
	const loadProducts = useProductStore(state=>state.loadProducts)
	const setProducts = useProductStore(state=>state.setProducts)
 	
	const products = useInfScroll(
		storeProducts,
		loadProducts,
		endRef,
		10,
		search
	)
	React.useEffect(()=>setProducts(Object.fromEntries(
		initProducts.map(prod=>[prod.id,prod])
	)),[])

	return (
		<div className="bg-green-100">
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
						id = {product.id}
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
