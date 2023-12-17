"use client"
import Form from "./index"
import React from "react"
import LabeledInput, { InputOptionStaticProps, InputGeneralProps } from "../ui/LabeledInput/index.tsx"
import { clientValidations } from "./common.ts"

const formFieldValues: {
	name: string
	description: string
	image: File[]
} = {
	name: "",
	description: "",
	image: [],
} as const
const action = "/api/brand"

const validation = {
	name: clientValidations.name,
	image: clientValidations.images,
	description: clientValidations.description,
}


type Props =
	| {
		method: "PUT"
	}
	| {
		method: "PATCH"
		targId?: string
		targName?: string
	}

export default function BrandForm(props: Props) {
	const [fieldValues, setFieldValues] = React.useState(formFieldValues)
	const fieldProps: Record<
		keyof typeof formFieldValues,
		InputGeneralProps & InputOptionStaticProps
	> = {
		name: {
			type: "text",
			id: "name",
			label: "Brand name",
			placeholder: "Brand",
			validator: validation.name,
		},
		description: {
			type: "text",
			id: "description",
			label: "Brand description",
			placeholder: "Text",
			validator: validation.description,
		},
		image: {
			type: "file",
			id: "image",
			label: "Brand image",
			multiple: false,
			accept: "image/jpeg",
			validator: validation.image,
		},
	} as const
	return (
		<Form
			className=""
			action={action}
			method={"PUT"}
			fieldValues={fieldValues}
			fieldProps={fieldProps}
			setFieldValues={setFieldValues}
		/>
	)
}
