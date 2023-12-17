"use client"

import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { useHydrate, ProductProvider } from "@/store/productsStore/productStore"
import React from "react"

type Props = {
	products:PopulatedProduct[]
	children:React.ReactNode
}
export default function ProductStoreProvider({products,children}:Props){
	const	store = useHydrate({products:products})
	return(
		<ProductProvider value={store}>
			{children}
		</ProductProvider>
	)
}
