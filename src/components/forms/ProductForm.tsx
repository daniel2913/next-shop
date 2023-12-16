"use client"
import {clientValidations} from "./common.ts"
import Form,{FormFieldValue } from "./index"
import React from "react"
import LabeledInput, { InputGeneralProps, InputOptionDynamicProps, InputOptionProps, InputOptionStaticProps } from "@/components/ui/LabeledInput"
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

interface Props {
	brandList: Brand[]
	categoryList: Category[]
}
export default function ProductForm({ brandList, categoryList }: Props) {
	const [fieldValues, setFieldValues] = React.useState(formFieldValues)

const fieldProps: {
	[I in keyof typeof formFieldValues]: 
		InputGeneralProps
		&InputOptionStaticProps
		&Omit<InputOptionDynamicProps,"value"|"setValue">
} = {
	name: {
		type: "text",
		id: "name",
		label: "Product name",
		placeholder: "Product",
		validator: validation.name,
	},
	description: {
		type: "text",
		id: "description",
		label: "Product description",
		placeholder: "Text",
		validator: validation.description,
	},
	brand: {
		type: "select",
		id: "brand",
		label: "Product brand",
		placeholder: "test",
		options:brandList.map((brand) => brand.name),
	},
	category: {
		type: "select",
		id: "category",
		label: "Product category",
		placeholder: "test",
		options:categoryList.map((category) => category.name),
	},
	price: {
		type: "text",
		id: "price",
		label: "Product price",
		placeholder: "test",
		validator: validation.price,
	},
	images: {
		type: "file",
		id: "image",
		label: "Product image",
		multiple: true,
		accept: "image/jpeg",
		validator: validation.images,
	},
} as const
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
