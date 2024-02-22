"use client"
import { FormFieldValue, clientValidations } from "./common.tsx"
import Form from "./common.tsx"
import React from "react"
import PreviewProductCard from "@/components/product/card/Preview.tsx"
import { changeProductAction, createProductAction } from "@/actions/product"
import Input from "../ui/Input.tsx"
import ImageUpload from "../ui/ImageUpload.tsx"
import {
	Select,
	SelectItem,
	SelectValue,
	SelectTrigger,
	SelectContent,
} from "../ui/Select.tsx"
import { getAllBrandNamesAction } from "@/actions/brand.ts"
import { getAllCategoryNamesAction } from "@/actions/category.ts"
import { PopulatedProduct } from "@/lib/Models/Product.ts"
import useImageFiles from "@/hooks/useImageFiles.ts"
import useAction from "@/hooks/useAction.ts"
import { Textarea } from "../ui/Textarea.tsx"
import { Label } from "../ui/Label.tsx"
import ImagesPreview from "../ui/ImagesPreview.tsx"

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
	product?: Partial<PopulatedProduct>
}

export default function ProductForm({ product }: Props) {
	const action = product?.id
		? (form: FormData) => changeProductAction(product.id!, form)
		: createProductAction
	const [name, setName] = React.useState(product?.name || "")
	const [description, setDescription] = React.useState(
		product?.description || ""
	)
	const [brand, setBrand] = React.useState(product?.brand?.name || "")
	const [category, setCategory] = React.useState(product?.category?.name || "")
	const [price, setPrice] = React.useState(product?.price || 0)
	const [images, setImages] = useImageFiles(
		product?.images?.map((image) => `/products/${image}`) || []
	)

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
						images,
					}}
				/>
			}
		>
			<Label>
				Product Name
				<Input
					name={"name"}
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
				/>
			</Label>
			<Label>
				Description
				<Textarea
					name={"description"}
					value={description}
					onChange={(e) => setDescription(e.currentTarget.value)}
				/>
			</Label>
			<Label>
				Brand
				<Select
					name="brand"
					value={brand}
					onValueChange={(str: string) => setBrand(str)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Brand" />
					</SelectTrigger>
					<SelectContent className="z-[1000]">
						{brands.map((brand, idx) => (
							<SelectItem
								value={brand}
								key={brand + idx}
							>
								{brand}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Label>
			<Label>
				Category
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
						{categories.map((category, idx) => (
							<SelectItem
								value={category}
								key={category + idx}
							>
								{category}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Label>
			<Label>
				Price
				<Input
					label="Price"
					name="price"
					type="number"
					value={price.toString()}
					onChange={(e) => setPrice(+Number(e.target.value).toFixed(2))}
				/>
			</Label>
			<Label className="h-fit w-fit">
				Images
				<ImageUpload
					name="images"
					multiple
					value={images}
					onChange={(files: File[]) => setImages(files)}
					accept="image/jpeg"
				/>
			</Label>
			<ImagesPreview
				className="w-full"
				images={images}
				delImage={(idx: number) => {
					setImages(images.filter((_, idxOld) => idx !== idxOld))
				}}
			/>
		</Form>
	)
}
