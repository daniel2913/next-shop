"use client"
import Form from "@/components/forms"
import React, { ComponentProps } from "react"

type RegisterFields = {
	name: string
	password: string
}

const formProps: Omit<
	ComponentProps<typeof Form<RegisterFields>>,
	"fieldValues" | "method" | "setFieldValues" | "className" | "children"
> = {
	action: "/api/user",
	fieldProps: {
		name: {
			id: "name",
			type: "text",
			label: "Username",
			placeholder: "JohnSmith",
		},
		password: {
			id: "password",
			type: "password",
			label: "Password",
		},
	},
}

export default function Register() {
	const initialFieldValues: RegisterFields = {
		name: "",
		password: "",
	}
	const [fieldValues, setFieldValues] = React.useState(initialFieldValues)

	return (
		<Form<RegisterFields>
			method="PUT"
			className=""
			{...formProps}
			fieldValues={fieldValues}
			setFieldValues={setFieldValues}
		></Form>
	)
}
