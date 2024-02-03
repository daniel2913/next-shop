"use client"
import { createStore, create} from "zustand"
import { ProductsSlice, createProductsSlice } from "./productsSlice"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import React from "react"
import {useStoreWithEqualityFn} from "zustand/traditional"


let store: undefined|ReturnType<typeof initializeProductStore>


const useProductStore = create<ProductsSlice>()((...a) => ({
	...createProductsSlice(...a),
}))
export default useProductStore
// export function initializeProductStore(initProps?:{products:PopulatedProduct[]}){
// 	return createStore<ProductsSlice>()((...a) => ({
// 	...createProductsSlice(...a),
// 	...initProps,
// }))
// }

// export function useHydrate(initProps:{products:PopulatedProduct[]}){
// 	let _store = store ?? initializeProductStore(initProps)
// 	if (typeof window !== 'undefined'){
// 		if (!store){
// 			store = _store
// 		}
// 		//eslint-disable-next-line
// 		React.useEffect(()=>{
// 			if (initProps && store){
// 				store.setState({
// 					...store.getState(),
// 					...initProps
// 				})
// 			}
// 		},[initProps])
// 	}
// 	return _store
// }
//
// type ProductStore = ReturnType<typeof initializeProductStore>
//
// const ProductContext = React.createContext<ProductStore|null>(null)
// export const ProductProvider = ProductContext.Provider
//
// export default function useProductStore<T>(
// 	selector:(state:ProductsSlice)=>T,
// 	equalityFn?:(left:T,right:T)=>boolean
// ):T{
// 	const store = React.useContext(ProductContext)
// 	if(!store) throw new Error("Used outside of context!")
// 	return useStoreWithEqualityFn(store,selector,equalityFn)
// }
