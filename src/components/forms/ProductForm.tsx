"use client"
import { clientValidations } from "./common.ts"
import Form, { FormFieldValue } from "./index"
import React from "react"
import PreviewProductCard from "@/components/product/ProductCard/PreviewProductCard"
import { changeProductAction, createProductAction, getProductsByIdsAction } from "@/actions/product"
import Input from "../ui/Input/index.tsx"
import FileUpload from "../ui/FileUpload/index.tsx"
import Selector from "../ui/Selector/index.tsx"
import { getAllBrandNamesAction } from "@/actions/brand.ts"
import { getAllCategoryNamesAction } from "@/actions/category.ts"
import { PopulatedProduct } from "@/lib/DAL/Models/Product.ts"
import {Button, Textarea} from "@/components/material-tailwind"
import useImageFiles from "@/hooks/useImageFiles.ts"

const validation = {
	name: clientValidations.name,
	description: clientValidations.description,
	images: clientValidations.images,
	price: (value: FormFieldValue) => {
		if (Number.isNaN(Number(value))) return "Price can only be number!"
		if (+value <= 0) return "No Communism Allowed!"
		return false
	},
}

type ProductProps = {
	id?:number
	name: string
	description: string
	brand: string
	price: number
	category: string
	images: string[]
}

type Props = {
	product?:PopulatedProduct
}


export default function ProductForm({product}: Props) {
	
	const action = product?.id 
		? (form:FormData)=>changeProductAction(product.id,form) 
		: createProductAction
	const [name, setName] = React.useState(product?.name||"")
	const [description, setDescription] = React.useState(product?.description||"")
	const [brand, setBrand] = React.useState(product?.brand?.name||"")
	const [category, setCategory] = React.useState(product?.category?.name||"")
	const [price, setPrice] = React.useState(product?.price||0)
	const [images, setImages] = useImageFiles(product?.images.map(image=>`/products/${image}`)||[])

	React.useEffect(()=>{

		},[])


	return (
		<Form
			className=""
			validations={validation}
			action={action}
			preview={
				<PreviewProductCard
					className="h-80 w-64 p-2"
					product={{
						name,
						description,
						brand,
						category,
						price,
						images
					}}
				/>
			}
		>
			<Input
				crossOrigin={"false"}
				label="Product Name"
				id="name"
				name={"name"}
				value={name}
				validate={validation.name}
				setValue={(str: string) => setName(str)}
			/>
			<Textarea
				crossOrigin={"false"}
				name={"description"}
				label="Description"
				value={description}
				onChange={(e) => setDescription(e.currentTarget.value)}
			/>
			<Selector
				label="Brand"
				id="brand"
				value={brand}
				setValue={(str:string)=>setBrand(str)}
				fetchAction={getAllBrandNamesAction}
			/>
			<Selector
				label="Category"
				id="category"
				value={category}
				setValue={(str:string)=>setCategory(str)}
				fetchAction={getAllCategoryNamesAction}
			/>
			<Input
				crossOrigin={"false"}
				label="Price"
				name="price"
				type="number"
				value={price.toString()}
				setValue={(str: string) => setPrice(+str)}
			/>
			<FileUpload
			id= "images"
			label= "Product image"
			multiple
			value={images}
			onChange={(files:File[])=>setImages(files)}
			accept= "image/jpeg"
			preview
			/>
		</Form>
	)
}
