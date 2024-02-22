"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { ResponsiveProvider } from "./ResponsiveProvider"

type SessionProps = {
	children: React.ReactNode
	session: Session | null
}

export default function RootProviders({ children, session }: SessionProps) {
	return (
		<ResponsiveProvider>
			<SessionProvider
				refetchOnWindowFocus={false}
				session={session}
			>
				{children}
			</SessionProvider>
		</ResponsiveProvider>
	)
}
