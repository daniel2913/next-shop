"use client"
import { validateLogin, validatePassword } from "@/helpers/validation"
import Input from "@/components/UI/Input"
import useToast from "@/hooks/modals/useToast"
import { signIn } from "next-auth/react"
import React from "react"
import { registerUserAction } from "@/actions/user"
import { Button } from "@/components/UI/button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/UI/tabs"
import useProductStore from "@/store/productsStore/productStore"
import { Label } from "@/components/UI/label"
import Form from "@/components/forms"

type Props = {
	close?: () => void
}

function Register({ close }: Props) {
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const { show: showToast, handleResponse } = useToast()
	async function handleRegistration(creds: { name: string; password: string }) {
		setLoading(true)
		const res = await registerUserAction(creds.name, creds.password)
		setLoading(false)
		if (handleResponse(res)!==null)
			close?.()
	}
	return (
		<form
			className="flex flex-col gap-2 mb-4"
			onSubmit={(e)=>{
				e.preventDefault()
				handleRegistration({name,password})
			}}
		>

			<Label>
			Username
			<Input
				type="text"
				name="username"
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
				pattern="^[a-zA-Z][a-zA-Z0-9]{4,20}$"
			/>
			</Label>
			<Label>
			Password
			<Input
				type="password"
				name="password"
				value={password}
				onChange={(e)=>setPassword(e.currentTarget.value)}
				pattern={`^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!#$%&? "]).*$`}
			/>
			</Label>
			<Button
				disabled={loading}
				type="submit"
			>
				Register
			</Button>
		</form>

	)
}

function Login({close}: Props) {
	const reloadProducts = useProductStore(state=>state.reload)
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const { error } = useToast()
	async function handleLogin(creds: { name: string; password: string }) {
		setLoading(true)
		const res = await signIn("credentials", { ...creds, redirect: false })
		setLoading(false)
		if (res?.ok) {
			reloadProducts()
			close?.()
			return
		}
		error("Invalid username or password","Authentication Error")
	}
	return (
		<form
			className="flex flex-col gap-2 mb-4"
			onSubmit={(e)=>{
				e.preventDefault()
				handleLogin({name,password})
			}}
		>
			<Label>
				Username
			<Input
				type="text"
				name="username"
				value={name}
				onChange={(e)=>setName(e.currentTarget.value)}
			/>
			</Label>
			<Label>
				Password
			<Input
				type="password"
				name="password"
				value={password}
				onChange={(e)=>setPassword(e.currentTarget.value)}
			/>
			</Label>
			<Button
				disabled={loading}
				type="submit"
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
		</form>

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
