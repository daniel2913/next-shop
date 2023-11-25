"use client"
import Form, { FormFieldValidator, FormFieldValue } from "@/components/forms"
import { clientPasswordValidation } from "@/lib/DAL/Validations/User/passwordValidation/clientPasswordValidation"
import React from "react"

const formFieldValues = {
	name: "",
	password: "",
	image: null,
}
const action = "/api/user"

const validation: { [i in keyof typeof formFieldValues]: FormFieldValidator } =
	{
		name: (value: FormFieldValue) => {
			if (typeof value != "string")
				return { valid: false, msg: "Name can only be string!" }

			return value.length === 0
				? { valid: false, msg: "Name Required!" }
				: { valid: true }
		},
		password: (value: FormFieldValue) => {
			if (typeof value != "string")
				return { valid: false, msg: "Password can only be string!" }
			const error = clientPasswordValidation(value)
			if (error) return { valid: false, msg: error }
			return { valid: true }
		},
		image: (value: FormFieldValue) => {
			if (typeof value === "string")
				return { valid: false, msg: "Image can only be a file!" }
			if (!value) return { valid: true }
			const files = value instanceof File ? [value] : value
			if (files.length === 0) return { valid: false, msg: "zalupa" }
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
		type: "text",
		label: "Username",
		placeholder: "John",
		validator: validation["name"],
	},
	password: {
		id: "password",
		type: "password",
		label: "Password",
		placeholder: "****",
		validator: validation["password"],
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

export default function RegistrationForm() {
	const [fieldValues, setFieldValues] = React.useState(formFieldValues)
	return (
		<Form
			action={action}
			method="PUT"
			fieldValues={fieldValues}
			fieldProps={fieldProps}
			setFieldValues={setFieldValues}
		/>
	)
}
