'use client'
import Form from "@/components/forms"
import LabeledInput from "@/components/ui/LabeledInput"
import React, { ComponentProps, FormEvent } from "react"
interface Props {
	csrfToken: string
}


type Login = {
	name: string
	password: string
	csrfToken: string
}


const formProps: Omit<ComponentProps<typeof Form<Login>>, 'fieldValues'| 'method' | 'setFieldValues' | 'className' | 'children'> = {
	action: '/api/auth/callback/credentials',
	fieldProps: {
		csrfToken: {
			id: "csrfToken",
			type: "hidden",
		},
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
		}
	}
}


export default function Login({ csrfToken }: Props) {
	
	const initialFieldValues:Login = {
		csrfToken:csrfToken,
		name:"",
		password:""
	}
	const [fieldValues, setFieldValues] = React.useState(initialFieldValues)

	return (
			<Form<Login>
				method="POST"
				className=""
				{...formProps}
				fieldValues={fieldValues}
				setFieldValues={setFieldValues}
			>
				</Form>
	)
}
