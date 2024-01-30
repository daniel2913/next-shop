import React from "react";
import useModal from "./modals/useModal";
import dynamic from "next/dynamic";

const ProductList = dynamic(import("@/components/UI/ProductList"))


export default function useProductList(){
	const {show:_show} = useModal()
	const [products,setProducts] = React.useState<number[]>([])
	function show(){
		_show(
			<ProductList
				value={products}
				onChange={(id:number)=>{
					const idx = products.indexOf(id)
					if (idx===-1) setProducts([...products,idx])
					else setProducts(products.filter(prod=>prod!==id))
				}}
			/>
		)
	}
	return [products,show] as [number[],()=>void]
}
