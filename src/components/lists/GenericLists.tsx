"use client"

import { useProducts } from "@/hooks/useInfScroll"
import { PopulatedProduct } from "@/lib/Models/Product"
import Loading from "../ui/Loading"
import ProductCard from "../product/ProductCard"

type GenericProps = {
	products: PopulatedProduct[]
}
export function GenericProductList(props:GenericProps){
	const {products,loading,reloadOne,updateOne} = useProducts(props.products)
	return (
		<>
		<Loading loading={loading}>
			{products.map((product) => (
				<ProductCard
					key={`${product.id}`}
					{...product}
					reload={reloadOne}
					update={updateOne}
				/>
			))}
		</Loading>
		</>
	)
}

export function GenericInfProductList(props:Props)
