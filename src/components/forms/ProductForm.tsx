"use client"
import { clientValidations } from "./common.ts"
import Form, { FormFieldValue } from "./index"
import React from "react"
import PreviewProductCard from "@/components/product/ProductCard/PreviewProductCard"
import { createProduct } from "@/actions/getProducts.ts"
import Input from "../ui/Input/index.tsx"
import FileUpload from "../ui/FileUpload/index.tsx"
import Selector from "../ui/Selector/index.tsx"
import { getAllBrandNamesAction } from "@/actions/brand.ts"
import { getAllCategoryNamesAction } from "@/actions/category.ts"


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
	name: string
	description: string
	brand: string
	price: number
	category: string
	images: File[] | string[]
}

type Props = {
	initValues?: Partial<ProductProps>
}

export default function ProductForm({ initValues }: Props) {

	const [name, setName] = React.useState(initValues?.name||"")
	const [description, setDescription] = React.useState(initValues?.description||"")
	const [brand, setBrand] = React.useState(initValues?.brand||"")
	const [category, setCategory] = React.useState(initValues?.category||"")
	const [price, setPrice] = React.useState(initValues?.price||0)

	const [images, setImages] = React.useState<File[]>(
		initValues?.images?.filter(image=>image instanceof File) as File[]||[])

	React.useEffect(()=>{
		async function fetchImages() {
			let loadingBlobs: Promise<Blob>[] = []
			for (const image of images) {
				if (image instanceof File || typeof image !== "string") continue
				loadingBlobs.push(fetch(image).then(res => res.blob()))
			}
			const loadedFiles = (await Promise.all(loadingBlobs)).map(blob =>
				new File([blob], "image.jpg", { type: blob.type })
			)
			setImages([...images, ...loadedFiles.filter(file => file.type === "image/jpeg")])
		}
		fetchImages()
		},[])
	return (
		<Form
			className=""
			validations={validation}
			action={createProduct}
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
				crossOrigin={false}
				label="Product Name label"
				id="name"
				name={"name"}
				value={name}
				validate={validation.name}
				setValue={(str: string) => setName(str)}
			/>
			<Input
				crossOrigin={false}
				name={"description"}
				label="Description"
				value={description}
				setValue={(str: string) => setDescription(str)}
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
				crossOrigin={false}
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
