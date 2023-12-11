"use client"
import {clientValidations} from "./common.ts"
import Form,{FormFieldValue } from "./index"
import React from "react"
import LabeledInput from "@/components/ui/LabeledInput"
import { Brand, Category } from "@/lib/DAL/Models"
import PreviewProductCard from "@/components/product/ProductCard/PreviewProductCard"

const formFieldValues: {
	name: string
	description: string
	brand: string
	price: string
	category: string
	images: File[]
} = {
	name: "",
	brand: "",
	description: "",
	price: "",
	category: "",
	images: [],
}
const action = "/api/product"

const validation={
	name: clientValidations.name,
	description: clientValidations.description,
	images: clientValidations.images,
	price: (value: FormFieldValue) => {
		if (Number.isNaN(Number(value))) return "Price can only be number!"
		if (+value<=0) return "No Communism Allowed!"
		return false
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
		type: "select",
	},
	category: {
		id: "category",
		type: "select",
		label: "Product category",
		placeholder: "test",
	},
	price: {
		id: "price",
		type: "text",
		label: "Product price",
		placeholder: "test",
		validator: validation.price,
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
export default function ProductForm({ brandList, categoryList }: Props) {
	const [fieldValues, setFieldValues] = React.useState(formFieldValues)
	fieldProps.brand.selectProps = {
		options: brandList.map((brand) => brand.name),
		id:fieldProps.brand.id,
		label:fieldProps.brand.label,
		value:fieldValues.brand,
		setValue:(val:string)=>setFieldValues(prev=>({...prev,brand:val}))
	}
	fieldProps.category.selectProps = {
		options: categoryList.map((category) => category.name),
		id:fieldProps.category.id,
		label:fieldProps.category.label,
		value:fieldValues.category,
		setValue:(val:string)=>setFieldValues(prev=>({...prev,category:val}))
	}
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
					brandImage:
						brandList.find((brand) => brand.name === fieldValues.brand)
							?.image || "template.jpeg",
				}}
			/>
		</Form>
	)
}
