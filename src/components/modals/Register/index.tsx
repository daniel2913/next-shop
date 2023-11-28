'use client'
import Form from "@/components/forms"
import LabeledInput from "@/components/ui/LabeledInput"
import React, { ComponentProps, FormEvent } from "react"
interface Props {
	csrfToken: string
}


type Register = {
	name: string
	password: string
}


const formProps: Omit<ComponentProps<typeof Form<Register>>, 'fieldValues'| 'method' | 'setFieldValues' | 'className' | 'children'> = {
	action: '/api/user',
	fieldProps:{	
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

export default function Register() {
	
	const initialFieldValues:Register = {
		name:"",
		password:""
	}
	const [fieldValues, setFieldValues] = React.useState(initialFieldValues)

	return (
			<Form<Register>
				method="PUT"
				className=""
				{...formProps}
				fieldValues={fieldValues}
				setFieldValues={setFieldValues}
			>
				</Form>
	)
}
