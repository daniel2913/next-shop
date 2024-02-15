"use client"
import Heart from "@/../public/heart.svg"
import Edit from "@/../public/edit.svg"
import React  from "react"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import { PopulatedProduct } from "@/lib/Models/Product"
import { Button } from "@/components/ui/Button"

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

type EditProps = {
	product:PopulatedProduct
	className?:string
	onClose?:()=>void
}

export function EditProduct({ product,className,onClose}:EditProps) {
	const modal = useModal()
	return (
		<Button
			className={`${className} p-0 bg-transparent hover:bg-transparent appearance-none w-full flex justify-between`}
			onClick={() => {
				modal.show(
					<ProductForm product={product} />
				).then(() => onClose?.())
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
