"use client"

import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import {ProductProvider, useHydrate} from "@/store/productsStore/productStore"
import React from "react"
export default function ProductStoreProvider({products,children}:{products:PopulatedProduct[],children:React.Component[]}){
	const initProps = new Map(products.map(prod=>[prod.id,prod]))
	const store = useHydrate({products:initProps})
	return (
		<ProductProvider>
			{children}
	)
}
