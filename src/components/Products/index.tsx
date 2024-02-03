"use client"
import ProductCard from "@/components/Product/ProductCard"
import useInfScroll from "@/hooks/useInfScroll"
import type { PopulatedProduct } from "@/lib/DAL/Models/Product"
import useProductStore from "@/store/productsStore/productStore"
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../UI/select"
type Props = {
	products: PopulatedProduct[]
}

function keyCompare(oldObj: PopulatedProduct[], newObj: PopulatedProduct[]) {
const res = newObj.every((val,idx)=>val===oldObj[idx])
	return res}

export default function ProductList({ products: initProducts }: Props) {
	let scrollProducts:null|PopulatedProduct[] = null
	const endRef = React.useRef<HTMLDivElement>(null)
	if (typeof window !== "undefined") {
		//eslint-disable-next-line
		let storeProducts = useProductStore(state => state.products, keyCompare)
		//eslint-disable-next-line
		const loadProducts = useProductStore(state => state.loadProducts)
		//eslint-disable-next-line
		scrollProducts = useInfScroll(
			storeProducts,
			loadProducts,
			endRef,
			10,
		)
	}
	const products = scrollProducts ?? initProducts

	return (
		<div className="bg-background">
			<Select>
				<SelectTrigger>
					<SelectValue/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="1">
						One
					</SelectItem>
					<SelectItem value="2">
						Two
					</SelectItem>
				</SelectContent>
			</Select>
			<div
				className="
					h-full p-5 w-
					grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]
					gap-y-4
					items-center justify-items-center
				"
			>
				{products.map((product) => (
					<ProductCard
						key={`${product.id}`}
						product={product}
					/>
				))}
				<div
					className="relative bottom-96 invisible"
					ref={endRef}
				>
					...
				</div>
			</div>
		</div>
	)
}
