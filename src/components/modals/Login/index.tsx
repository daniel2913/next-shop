"use client"
import LabeledInput from "@/components/ui/LabeledInput"
import { clientPasswordValidation } from "@/lib/DAL/Validations/User/passwordValidation/clientPasswordValidation"
import { clientUserNameValidation } from "@/lib/DAL/validations/user/usernameValidation/clientUsernameValidation"
import { signIn } from "next-auth/react"
import React  from "react"

type Props = {
	close: () => void
	reloadProducts: ()=>void
}

export default function Login({ close,reloadProducts }: Props) {
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [status, setStatus] = React.useState("")
	console.log(reloadProducts)
	function handleLogin(creds: { name: string; password: string }) {
		signIn("credentials", { ...creds, redirect: false })
			.then((res) => {
				if (res?.ok) {
					close()
					reloadProducts()
				} else setStatus(res?.error || "Something bad happend")
			})
			.catch((res) => setStatus(res))
	}
	return (
		<div>
			<span>{status}</span>
			<LabeledInput
				type="text"
				label="Username"
				id="name"
				value={name}
				setValue={setName}
				validator={(val) =>
					typeof val === "string"
						? clientUserNameValidation(val)
						: "Username must be a string"
				}
			/>
			<LabeledInput
				type="password"
				label="password"
				id="password"
				value={password}
				setValue={setPassword}
				validator={(val) =>
					typeof val === "string"
						? clientPasswordValidation(val)
						: "Password must be a string"
				}
			/>
			<button
				type="submit"
				onClick={() => handleLogin({ name, password })}
			>
				Sign In
			</button>
			<button
				type="submit"
				onClick={() => handleLogin({ name: "user", password: "user" })}
			>
				Demo User
			</button>
			<button
				type="submit"
				onClick={() => handleLogin({ name: "admin", password: "admin" })}
			>
				Demo Admin
			</button>
		</div>
	)
}
