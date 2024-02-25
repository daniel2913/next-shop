"use client"
import { registerUserAction } from "@/actions/user"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import React from "react"
import { useToastStore } from "@/store/ToastStore"

export type Props = {
	close?: () => void
	redirect?: string
}

export function Register({ close, redirect }: Props) {
	const [name, setName] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)
	const router = useRouter()
	const isValidResponse = useToastStore((s) => s.isValidResponse)
	const error = useToastStore((s) => s.error)
	async function handleRegistration(creds: { name: string; password: string }) {
		setLoading(true)
		const res = await registerUserAction(creds.name, creds.password)
		setLoading(false)
		if (!isValidResponse(res)) return
		const signRes = await signIn("credentials", { ...creds, redirect: false })
		if (!signRes?.ok) {
			error("Unknown Error", "Internal Error")
			return
		}
		if (redirect) router.push(redirect)
		if (close) close()
	}

	return (
		<form
			className="mb-4 flex flex-col items-center gap-2 px-20"
			onSubmit={async (e) => {
				e.stopPropagation()
				e.preventDefault()
				await handleRegistration({ name, password })
			}}
		>
			<Label>
				Username
				<Input
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
					autoComplete="current-password"
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
