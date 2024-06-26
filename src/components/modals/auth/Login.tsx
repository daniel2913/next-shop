"use client";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { error } from "@/components/ui/use-toast";

export type Props = {
	close?: () => void;
	redirect?: string;
};

export function Login({ close, redirect }: Props) {
	const [name, setName] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();
	async function handleLogin(creds: { name: string; password: string }) {
		const res = await signIn("credentials", { ...creds, redirect: false });
		if (res?.ok) {
			if (redirect) router.push(redirect);
			else if (close) close();
			return;
		}
		error({ error: "Invalid username or password", title: "Authentication Error" });
	}
	return (
		<form
			className="mb-4 flex flex-col items-center gap-2"
			onSubmit={async (e) => {
				setLoading(true);
				e.preventDefault();
				e.stopPropagation();
				await handleLogin({ name, password });
				setLoading(false);
				dispatchEvent(new Event("submit"));
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
					autoComplete="current-password"
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
				/>
			</Label>
			<div className="mt-2 flex flex-col gap-2">
				<Button disabled={loading} type="submit">
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
	);
}
