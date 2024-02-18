"use client"
import { registerUserAction } from "@/actions/user"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comps/ui/Tabs"
import useToast from "@/hooks/modals/useToast"
import useProductStore from "@/store/productStore"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	close?: () => void
	redirect?: string
}

function Register({ close, redirect }: Props) {
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const router = useRouter()
	const { error, handleResponse } = useToast()
	async function handleRegistration(creds: { name: string; password: string }) {
		setLoading(true)
		const res = await registerUserAction(creds.name, creds.password)
		setLoading(false)
		if (!handleResponse(res)) return
		const signRes = await signIn("credentials", { ...creds, redirect: false },)
		if (!signRes?.ok) {
			error("Unknown Error", "Internal Error")
			return
		}
		if (redirect)
			router.push(redirect)
		if (close)
			close()

	}
	const [status,setStatus] = React.useState("")

	function validate(val:string){
		if (val.length<5 || val.length>20) return "Username must be between 5 and 20 characters long"
		if (!val.match(/^[a-zA-Z]/)) return "Username must start with a letter"
		if (!val.match(/^[a-zA-Z0-9]/)) return ("Username must only contain letters and numbers")
		return ""
	}
	return (
		<form
			className="flex items-center flex-col px-20 gap-2 mb-4"
			onSubmit={async (e) => {
				e.stopPropagation()
				e.preventDefault()
				await handleRegistration({ name, password })
			}}
		>
			<Label>
				Username
				<Input
					onBlur={()=>setStatus(validate(name))}
					type="text"
					autoFocus={true}
					name="username"
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
					title="Username must be between 5 and 20 characters long, starts with a letter and only contain letters and numbers"
					pattern="^[a-zA-Z][a-zA-Z0-9]{5,20}"
				/>
			</Label>
			<Label>
				Password
				<Input
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
					pattern={`.{5,20}`}
					title="Password must be beetween 5 and 20 characters long"
				/>
			</Label>
			<Button
				className="mt-2"
				disabled={loading}
				type="submit"
			>
				Register
			</Button>
		</form>

	)
}

function Login({ close, redirect }: Props) {
	const reloadProducts = useProductStore(state => state.reload)
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const router = useRouter()
	const { error, handleResponse } = useToast()
	async function handleLogin(creds: { name: string; password: string }) {
		const res = await signIn("credentials", { ...creds, redirect: false })
		if (res?.ok) {
			handleResponse(await reloadProducts())
			if (redirect)
				router.push(redirect)
			else if (close)
				close()
			return
		}
		error("Invalid username or password", "Authentication Error")
	}
	return (
		<form
			className="flex flex-col items-center gap-2 mb-4"
			onSubmit={async (e) => {
				setLoading(true)
				e.preventDefault()
				e.stopPropagation()
				await handleLogin({ name, password })
				setLoading(false)
				dispatchEvent(new Event('submit'))
			}}
		>
			<Label>
				Username
				<Input
					autoFocus={true}
					type="text"
					name="username"
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
				/>
			</Label>
			<Label>
				Password
				<Input
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
				/>
			</Label>
			<div className="flex flex-col gap-2 mt-2">
				<Button
					disabled={loading}
					type="submit"
				>
					Sign In
				</Button>
				<Button
					disabled={loading}
					type="button"
					onClick={() => handleLogin({ name: "user", password: "user" })}
				>
					Demo User
				</Button>
				<Button
					disabled={loading}
					type="button"
					onClick={() => handleLogin({ name: "admin", password: "admin" })}
				>
					Demo Admin
				</Button>
			</div>
		</form>

	)
}

export default function AuthModule(props: Props) {
	return (
		<Tabs
			className="
				w-max h-max mt-8 md:mt-0
				lg:w-[33vw] lg:h-[45vh]
				flex flex-col justify-start
			"
			defaultValue="login">
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
