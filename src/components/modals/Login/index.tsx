"use client"
import { validateLogin, validatePassword } from "@/helpers/validation"
import Input from "@/components/UI/Input"
import useToast from "@/hooks/modals/useToast"
import { signIn } from "next-auth/react"
import React from "react"
import { registerUserAction } from "@/actions/user"
import { Button } from "@/components/UI/button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/UI/tabs"

type Props = {
	close: () => void
	reloadProducts: () => void
}

function Register({ close }: Props) {
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const { show: showToast } = useToast()
	async function handleRegistration(creds: { name: string; password: string }) {
		setLoading(true)
		const res = await registerUserAction(creds.name, creds.password)
		setLoading(false)
		if (res)
			showToast(res)
	}
	return (
		<div
			className="flex flex-col gap-2 mb-4"
		>
			<Input
				type="text"
				label="Username"
				value={name}
				onChange={() => setName}
				validate={validateLogin}
			/>
			<Input
				type="password"
				label="Password"
				value={password}
				onChange={setPassword}
				validate={validatePassword}
			/>
			<Button
				disabled={loading}
				type="submit"
				onClick={() => handleRegistration({ name, password })}
			>
				Register
			</Button>
		</div>

	)
}

function Login({ close, reloadProducts }: Props) {
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const { show: showToast } = useToast()
	async function handleLogin(creds: { name: string; password: string }) {
		setLoading(true)
		const res = await signIn("credentials", { ...creds, redirect: false })
		setLoading(false)
		if (res?.ok) {
			close()
			reloadProducts()
			return
		}
		showToast(res?.error || "Something bad happend")
	}
	return (
		<div
			className="flex flex-col gap-2 mb-4"
		>
			<Input
				type="text"
				label="Username"
				value={name}
				onChange={(e)=>setName(e.currentTarget.value)}
			/>
			<Input
				type="password"
				label="Password"
				value={password}
				onChange={(e)=>setPassword(e.currentTarget.value)}
			/>
			<Button
				disabled={loading}
				type="submit"
				onClick={() => handleLogin({ name, password })}
			>
				Sign In
			</Button>
			<Button
				disabled={loading}
				type="submit"
				onClick={() => handleLogin({ name: "user", password: "user" })}
			>
				Demo User
			</Button>
			<Button
				disabled={loading}
				type="submit"
				onClick={() => handleLogin({ name: "admin", password: "admin" })}
			>
				Demo Admin
			</Button>
		</div>

	)
}

export default function AuthModal(props: Props) {
	return (
		<Tabs
			className="
				w-max h-max
				lg:w-[33vw] lg:h-[45vh]
				flex flex-col justify-start
			"
			value="login">
			<TabsList>
				<TabsTrigger value="login">
					Login
				</TabsTrigger>
				<TabsTrigger value="register">
					Register
				</TabsTrigger>
			</TabsList>
			<TabsContent value="login">
				<Login {...props} />
			</TabsContent>
			<TabsContent value="register">
				<Register {...props} />
			</TabsContent>
		</Tabs>
	)
}
