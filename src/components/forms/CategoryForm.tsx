"use client"
import Form, {
	FormFieldValidator,
	FormFieldValue,
} from "./index"
import React from "react"

const formFieldValues = { name: "", image: null } as const
const action = "/api/category"

const validation: {
	[i in keyof typeof formFieldValues]: FormFieldValidator
} = {
	name: (value: FormFieldValue) => {
		if (typeof value != "string")
			return { valid: false, msg: "Name can only be string!" }

		return value.length === 0
			? { valid: false, msg: "Name Required!" }
			: { valid: true }
	},
	image: (files: FormFieldValue) => {
		if (!files || typeof files === "string")
			return { valid: false, msg: "Image can only be a file!" }
		for (const file of files) {
			const ext = file.name.split(".").pop()
			if (ext != "jpeg" && ext != "jpg")
				return { valid: false, msg: "Only jpegs!" }
			if (file.size > 1024 * 512)
				return { valid: false, msg: "Only under 0.5MB!" }
		}

		return { valid: true }
	},
}

const fieldProps = {
	name: {
		id: "name",
		label: "Category name",
		placeholder: "category",
		validator: validation["name"],
	},
	image: {
		id: "image",
		label: "Category image",
		type: "file",
		multiple: false,
		accept: "image/jpeg",
		validator: validation["image"],
	},
} as const

export default function CategoryForm({
	method = "PUT",
}: {
	method: "PUT" | "PATCH"
}) {
	const [fieldValues, setFieldValues] =
		React.useState(formFieldValues)
	return (
		<Form
			action={action}
			method={method}
			fieldValues={fieldValues}
			fieldProps={fieldProps}
			setFieldValues={setFieldValues}
		/>
	)
}
