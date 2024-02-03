"use client"
import { clientValidations } from "./common.ts"
import Form, { FormFieldValue } from "./index"
import React from "react"
import PreviewProductCard from "@/components/product/ProductCard/PreviewProductCard"
import { changeProductAction, createProductAction } from "@/actions/product"
import Input from "../UI/Input"
import FileUpload from "../UI/FileUpload/index.tsx"
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "../UI/select"
import { getAllBrandNamesAction } from "@/actions/brand.ts"
import { getAllCategoryNamesAction } from "@/actions/category.ts"
import { PopulatedProduct } from "@/lib/DAL/Models/Product.ts"
import useImageFiles from "@/hooks/useImageFiles.ts"
import useAction from "@/hooks/useAction.ts"
import { Textarea } from "../UI/textarea.tsx"

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

type Props = {
	product?: PopulatedProduct
}

export default function ProductForm({ product }: Props) {

	const action = product?.id
		? (form: FormData) => changeProductAction(product.id, form)
		: createProductAction
	const [name, setName] = React.useState(product?.name || "")
	const [description, setDescription] = React.useState(product?.description || "")
	const [brand, setBrand] = React.useState(product?.brand?.name || "")
	const [category, setCategory] = React.useState(product?.category?.name || "")
	const [price, setPrice] = React.useState(product?.price || 0)
	const [images, setImages] = useImageFiles(product?.images.map(image => `/products/${image}`) || [])

	const { value: brands } = useAction(getAllBrandNamesAction, [])
	const { value: categories } = useAction(getAllCategoryNamesAction, [])


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
				label="Product Name"
				id="name"
				name={"name"}
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
			/>
			<Textarea
				label="Description"
				name={"description"}
				id="description"
				value={description}
				onChange={(e) => setDescription(e.currentTarget.value)}
			/>
			<div className="z-[100]">
				<Select
					name="brand"
					value={brand}
					onValueChange={(str: string) => setBrand(str)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Brand" />
					</SelectTrigger>
					<SelectContent>
						{brands.map((brand, idx) =>
							<SelectItem value={brand} key={brand + idx}>{brand}</SelectItem>)
						}
					</SelectContent>
				</Select>
			</div>
			<Select
				defaultValue={product?.category.name || category}
				name="category"
				value={category}
				onValueChange={(str: string) => setCategory(str)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Category" />
				</SelectTrigger>
				<SelectContent>
					{categories.map((category, idx) =>
						<SelectItem value={category} key={category + idx}>{category}</SelectItem>)
					}
				</SelectContent>
			</Select>
			<Input
				label="Price"
				name="price"
				type="number"
				value={price.toString()}
				onChange={(e) => setPrice(+Number(e.target.value).toFixed(2))}
			/>
			<FileUpload
				id="images"
				label="Product image"
				multiple
				value={images}
				onChange={(files: File[]) => setImages(files)}
				accept="image/jpeg"
				preview
			/>
		</Form>
	)
}
