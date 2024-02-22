"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comps/ui/Tabs"
import React from "react"
import { Register } from "./Register"
import { Login } from "./Login"

export type Props = {
	close?: () => void
	redirect?: string
}

export default function AuthModule(props: Props) {
	return (
		<Tabs
			className="
				mt-8 flex h-max w-max
				flex-col justify-start
				md:mt-0 lg:h-[45vh] lg:w-[33vw]
			"
			defaultValue="login"
		>
			<TabsList>
				<TabsTrigger value="login">Login</TabsTrigger>
				<TabsTrigger value="register">Register</TabsTrigger>
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
