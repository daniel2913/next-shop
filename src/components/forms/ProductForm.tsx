"use client"
import Form, {
	FormFieldValidator,
	FormFieldValue,
} from "./index"
import React from "react"
import LabeledInput from "@/components/ui/LabeledInput"
import { Brand, Category } from "@/lib/DAL/Models"
import PreviewProductCard from "@/components/product/ProductCard/PreviewProductCard"

const formFieldValues: {
	name: string
	description: string
	brand: string
	price: string
	discount: string
	category: string
	images: File[]
} = {
	name: "",
	brand: "",
	description: "",
	price: "",
	discount: "",
	category: "",
	images: [],
}
const action = "/api/product"

const validation: {
	[I in keyof typeof formFieldValues]: FormFieldValidator
} = {
	name: (value: FormFieldValue) => {
		if (typeof value !== "string")
			return { valid: false, msg: "Name can only be string!" }

		return value.length === 0
			? { valid: false, msg: "Name Required!" }
			: { valid: true }
	},
	images: (value: FormFieldValue) => {
		if (typeof value === "string")
			return { valid: false, msg: "Image can only be a file!" }
		if (!value) return { valid: true }
		const files = value instanceof File ? [value] : value
		if (files.length === 0)
			return { valid: false, msg: "zalupa" }
		for (const file of files) {
			const ext = file.name.split(".").pop()
			if (ext !== "jpeg" && ext !== "jpg")
				return { valid: false, msg: "Only jpegs!" }
			if (file.size > 1024 * 512)
				return { valid: false, msg: "Only under 0.5MB!" }
		}
		return { valid: true }
	},
	description: (value: FormFieldValue) => {
		if (typeof value !== "string")
			return {
				valid: false,
				msg: "Description can only be string!",
			}
		return value.length === 0
			? { valid: false, msg: "Description required" }
			: { valid: true }
	},
	brand: (value: FormFieldValue) => {
		return typeof value !== "string"
			? { valid: false, msg: "Brand can only be string!" }
			: { valid: true }
	},
	category: (value: FormFieldValue) => {
		return typeof value !== "string"
			? { valid: false, msg: "Category can only be string!" }
			: { valid: true }
	},
	price: (value: FormFieldValue) => {
		return Number.isNaN(Number(value))
			? { valid: false, msg: "Price can only be number!" }
			: { valid: true }
	},
	discount: (value: FormFieldValue) => {
		return Number.isNaN(Number(value))
			? { valid: false, msg: "Price can only be number!" }
			: { valid: true }
	},
}

const fieldProps: {
	[I in keyof typeof formFieldValues]: Omit<
		React.ComponentProps<typeof LabeledInput>,
		"value" | "setValue"
	>
} = {
	name: {
		id: "name",
		type: "text",
		label: "Product name",
		placeholder: "Product",
		validator: validation.name,
	},
	description: {
		id: "description",
		type: "text",
		label: "Product description",
		placeholder: "Text",
		validator: validation.description,
	},
	brand: {
		id: "brand",
		label: "Product brand",
		placeholder: "test",
		validator: validation.brand,
		type: "select",
	},
	category: {
		id: "category",
		type: "select",
		label: "Product category",
		placeholder: "test",
		validator: validation.category,
	},
	price: {
		id: "price",
		type: "text",
		label: "Product price",
		placeholder: "test",
		validator: validation.price,
	},
	discount: {
		id: "discount",
		type: "text",
		label: "Product discount",
		placeholder: "test",
		validator: validation.discount,
	},
	images: {
		id: "image",
		label: "Product image",
		type: "file",
		multiple: true,
		accept: "image/jpeg",
		validator: validation.images,
	},
}

interface Props {
	brandList: Brand[]
	categoryList: Category[]
}

export default function ProductForm({
	brandList,
	categoryList,
}: Props) {
	const [fieldValues, setFieldValues] =
		React.useState(formFieldValues)
	fieldProps.brand.options = brandList.map((brand) => brand.name)
	fieldProps.category.options = categoryList.map(
		(category) => category.name
	)
	return (
		<Form
			className=""
			action={action}
			method="PUT"
			fieldValues={fieldValues}
			fieldProps={fieldProps}
			setFieldValues={setFieldValues}
		>
			<PreviewProductCard
				className="h-80 w-64 p-2"
				product={{
					...fieldValues,
					price: +fieldValues.price,
					discount: +fieldValues.discount,
					brandImage:
						brandList.find(
							(brand) => brand.name === fieldValues.brand
						)?.image || "template.jpeg",
				}}
			/>
		</Form>
	)
}
