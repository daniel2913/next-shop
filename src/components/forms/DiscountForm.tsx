"use client"
import Form from "./index"
import React from "react"
import { InputGeneralProps, InputOptionDynamicProps, InputOptionStaticProps } from "@/components/ui/LabeledInput"
import { Brand, Category } from "@/lib/DAL/Models"

const formFieldValues: {
	discount: string
	brands: string[]
	categories: string[]
	expires: string
} = {
	discount: "0",
	brands: [],
	categories: [],
	expires: Date.now().toString()
}
const action = "/api/discount"


interface Props {
	brandList: Brand[]
	categoryList: Category[]
}
export default function DiscountForm({ brandList, categoryList }: Props) {
	const [fieldValues, setFieldValues] = React.useState(formFieldValues)

	const fieldProps: {
		[I in keyof typeof formFieldValues]:
		InputGeneralProps
		& InputOptionStaticProps
		& Omit<InputOptionDynamicProps, "value" | "setValue">
	} = {
		discount: {
			type: "text",
			id: "discount",
			label: "Discount",
			placeholder: "Product",
		},
		brands: {
			type: "checkboxes",
			view: "images",
			id: "brands",
			label: "Brands",
			options: brandList.map((brand) => brand.name),
			images: brandList.map((brand) => brand.image),

		},
		category: {
			type: "checkboxes",
			view: "images",
			id: "categories",
			label: "Categories",
			options: categoryList.map((category) => category.name),
			images: categoryList.map((category) => category.image),
		},
		expires: {
			type: "text",
			id: "products",
			label: "Products",
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
		/>
	)
}
