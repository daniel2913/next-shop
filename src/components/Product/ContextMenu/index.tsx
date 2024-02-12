"use client"
import Heart from "@/../public/heart.svg"
import Edit from "@/../public/edit.svg"
import React  from "react"
import useProductStore from "@/store/productsStore/productStore"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Button } from "@/components/UI/button"
import useToast from "@/hooks/modals/useToast"

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"))

export function ToggleFav({ value,onClick }: { value: boolean, onClick: ()=>void }) {
	return (
		<Button
			className="group p-0 bg-transparent hover:bg-transparent"
			title={value ? "Del from Favourite" : "Add to Favoutite"}
			onClick={onClick}
		>
			<Heart
				className={`${value 
					? "fill-accent"
					: "group-hover:fill-accent fill-transparent"
					}
				`}
				width={"30px"}
				height={"30px"}
				color="black"
				stroke="black"
			/>
		</Button>
	)
}

export function EditProduct({ product }: { product: PopulatedProduct }) {
	const modal = useModal()
	const reloader = useProductStore(state => state.reloadSingle)
	const reload = () => reloader(product.id)
	return (
		<Button
			className="p-0 appearance-none w-full flex justify-between"
			onClick={() => {
				modal.show(
					<ProductForm product={product} />
				).then(() => { reload() })
			}}
		>
			< Edit
				className="hover:stroke-accent"
				width={"30px"}
				height={"30px"}
			/>
		</Button>
	)
}
