"use client"
import { createStore} from "zustand"
import { ProductsSlice, createProductsSlice } from "./productsSlice"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import React, { useContext } from "react"
import {useStoreWithEqualityFn} from "zustand/traditional"


let store: undefined|ReturnType<typeof initializeProductStore>


export function initializeProductStore(initProps?:{products:PopulatedProduct[]}){
	return createStore<ProductsSlice>()((...a) => ({
	...createProductsSlice(...a),
	...initProps,
}))
}

export function useHydrate(initProps:{products:PopulatedProduct[]}){
	let _store = store ?? initializeProductStore(initProps)
	if (typeof window !== 'undefined'){
		if (!store){
			store = _store
		}
		//eslint-disable-next-line
		React.useLayoutEffect(()=>{
			if (initProps && store){
				store.setState({
					...store.getState(),
					...initProps
				})
			}
		},[initProps])
	}
	return _store
}

type ProductStore = ReturnType<typeof initializeProductStore>

const ProductContext = React.createContext<ProductStore|null>(null)
export const ProductProvider = ProductContext.Provider

export default function useProductStore<T>(
	selector:(state:ProductsSlice)=>T,
	equalityFn?:(left:T,right:T)=>boolean
):T{
	const store = useContext(ProductContext)
	if(!store) throw new Error("Used outside of context!")
	return useStoreWithEqualityFn(store,selector,equalityFn)
}
