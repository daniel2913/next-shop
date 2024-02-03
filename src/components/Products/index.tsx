"use client"
import ProductCard from "@/components/product/ProductCard"
import useInfScroll from "@/hooks/useInfScroll"
import type { PopulatedProduct } from "@/lib/DAL/Models/Product"
import useProductStore from "@/store/productsStore/productStore"
import React from "react"
import Link from "next/link"
type Props = {
	products: PopulatedProduct[]
}

function keyCompare(oldObj: PopulatedProduct[], newObj: PopulatedProduct[]) {
	const res = newObj.every((val, idx) => val === oldObj[idx])
	return res
}

export default function ProductList({ products: initProducts }: Props) {
	let scrollProducts: null | PopulatedProduct[] = null
	let inited = false
	const endRef = React.useRef<HTMLDivElement>(null)
	if (typeof window !== "undefined") {
		const storeProducts = useProductStore(state => state.products, keyCompare)
		const setProducts = useProductStore(state => state.setProducts)
		inited = useProductStore(state => state.inited)
		const loadProducts = useProductStore(state => state.loadProducts)
		scrollProducts = useInfScroll(
			storeProducts,
			loadProducts,
			endRef,
			10,
		)
		React.useEffect(() => { if (!inited) setProducts(initProducts) }, [initProducts])
	}
	const products = (inited && scrollProducts) || initProducts
	const [open, setOpen] = React.useState(false)
	return (
		<div className="bg-background">
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
