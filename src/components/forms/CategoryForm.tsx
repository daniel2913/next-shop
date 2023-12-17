"use client"
import { InputGeneralProps, InputOptionStaticProps } from "../ui/LabeledInput"
import { clientValidations } from "./common"
import Form, { FormFieldValidator, FormFieldValue } from "./index"
import React from "react"

const formFieldValues:{
	name:string
	image:File[]
} = {
	name: "",
	image: [] 
	} as const

const action = "/api/category"

const validation: {
	[i in keyof typeof formFieldValues]: FormFieldValidator
} = {
	name: clientValidations.name,
	image: clientValidations.images,
}


export default function CategoryForm({
	method = "PUT",
}: {
	method: "PUT" | "PATCH"
}) {
	const [fieldValues, setFieldValues] = React.useState(formFieldValues)
const fieldProps:Record<keyof typeof formFieldValues, InputGeneralProps&InputOptionStaticProps> = {
	name: {
		type: "text",
		id: "name",
		label: "Category name",
		placeholder: "category",
		validator: validation.name,
	},
	image: {
		type: "file",
		id: "image",
		label: "Category image",
		multiple: false,
		accept: "image/jpeg",
		validator: validation.image,
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
