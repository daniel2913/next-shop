"use client"
import ProductCard from "@/components/product/ProductCard"
import useInfScroll from "@/hooks/useInfScroll"
import type { PopulatedProduct } from "@/lib/DAL/Models/Product"
import useProductStore from "@/store/productsStore/productStore"
import React from "react"
type Props = {
	products: PopulatedProduct[]
}


function keyCompare(oldObj: PopulatedProduct[], newObj: PopulatedProduct[]) {
	const oldIds = oldObj.map(obj => obj.id)
	const newIds = newObj.map(obj => obj.id)
	return oldIds.toString() === newIds.toString()
}

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

	const products = scrollProducts || initProducts

	return (
		<div className="bg-green-100">
			<div className="">
				<div className="" />
				<div className="" />
			</div>
			<div
				className="
					h-full p-5
					grid sm:grid-cols-2  gap-y-8
					md:grid-cols-3 lg:grid-cols-4
					items-center justify-items-center
				"
			>
				{products.map((product) => (
					<ProductCard
						className="h-[22rem] w-64 p-2"
						key={`${product.id}`}
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
