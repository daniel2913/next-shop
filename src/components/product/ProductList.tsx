"use client"
import useInfScroll from "@/hooks/useInfScroll"
import type { PopulatedProduct } from "@/lib/Models/Product"
import useProductStore from "@/store/productStore"
import React from "react"
import ProductCard from "./ProductCard"
import { shallow } from "zustand/shallow"

type Props = {
	products: PopulatedProduct[]
}

export default function ProductList({ products: initProducts }: Props) {
	let scrollProducts: null | PopulatedProduct[] = null
	let inited = false
	const endRef = React.useRef<HTMLDivElement>(null)
	if (typeof window !== "undefined") {
		const storeProducts = useProductStore(state => state.products, shallow)
		inited = useProductStore.getState().inited
		const loadProducts = useProductStore.getState().loadProducts
		scrollProducts = useInfScroll(
			storeProducts,
			loadProducts,
			endRef,
			20,
		)
		React.useEffect(() => { if (!inited) { useProductStore.setState({ products: initProducts, inited: true }) } }, [])
	}
	const products = (inited && scrollProducts) || initProducts
	return (
		<div
			className="
					h-full p-5 bg-background
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
	)
}
