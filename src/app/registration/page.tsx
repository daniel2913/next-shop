import React from "react"
import Form from "@/components/forms/Registration"
import prepareNewUser from "@/actions/newUser"
import RegistrationForm from "@/components/forms/RegistrationForm"

export default function RegisterPage() {
	return (
		<div className="">
			<h1 className="">Registration</h1>
			<RegistrationForm />
		</div>
	)
}
