"use client"
import ProductCard from "@/components/product/ProductCard"
import type { PopulatedProduct } from "@/lib/DAL/Models/Product"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import React from "react"

type Props = {
	initProducts: PopulatedProduct[]
}


function useVotes(){
	const addVotes = useCartStore(state=>state.addVotes)
	return (products:PopulatedProduct[])=>{
	const votes = products
		.filter(product=>product.ownVote!==-1)
		.map(product=>[product.id,product.ownVote])
	addVotes(Object.fromEntries(votes))
	}
}

function useInfScroll<T extends any>(
	endpoint:string,
	initItems:T[],
	endRef:React.RefObject<HTMLDivElement>,
	pageSize:number = 20,
	searchParams:string|undefined
){
	const [items,setItems] = React.useState(initItems)
	const hasMore = React.useRef(true)
	const updateVotes = useVotes()
	const address = endpoint + 
		`?skip=${items.length}&page=${pageSize}` +
		(searchParams ? `&${searchParams}` : '')

	const nextObserver = React.useRef(
		new IntersectionObserver(async (entries)=>{
			if (!hasMore.current) return false
			if (!entries[0].isIntersecting) return false
			const res = await fetch(address,{method:"GET"})
			if (!res.ok) {
				console.error(res.status)
				hasMore.current=false
				return false
			}
			const newItems = await res.json()
			if (newItems.length<pageSize) hasMore.current = false
			setItems(prev=>[...prev,...newItems])
			updateVotes(newItems)
		})
	)
	React.useEffect(()=>{
		if (endRef.current){
			nextObserver.current.observe(endRef.current)
		}
	},[endRef])
	return items
}


export default function ProductList({initProducts}:Props){
	const updateVotes = useVotes()
	const session = useSession()
	const reloadVotes = useCartStore(state=>state.reloadVotes)
	let search = undefined
	if (window)
		search = window.location.search.slice(1)
	const endRef = React.useRef<HTMLDivElement>(null)
	const user = React.useRef<number|undefined>()
	const products = useInfScroll(
		'/api/product',
		initProducts,
		endRef,
		10,
		search
	)

	React.useEffect(()=>{
		if (user.current !== session.data?.user?.id){
			console.log(session.data?.user?.id)
			user.current = session.data?.user?.id
			reloadVotes(products.map(prod=>prod.id))
		}
	},[products,session])

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
						key={`${product.brand}/${product.name}`}
						product={product}
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
