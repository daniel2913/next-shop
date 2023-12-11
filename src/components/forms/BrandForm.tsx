"use client"
import Form  from "./index"
import React from "react"
import LabeledInput from "../ui/LabeledInput/index.tsx"
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

const fieldProps: {
	[I in keyof typeof formFieldValues]: Omit<
		React.ComponentProps<typeof LabeledInput>,
		"value" | "setValue"
	>
} = {
	name: {
		id: "name",
		type: "text",
		label: "Brand name",
		placeholder: "Brand",
		validator: validation["name"],
	},
	description: {
		id: "description",
		type: "text",
		label: "Brand description",
		placeholder: "Text",
		validator: validation["description"],
	},
	image: {
		id: "image",
		label: "Brand image",
		type: "file",
		multiple: false,
		accept: "image/jpeg",
		validator: validation["image"],
	},
} as const

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
