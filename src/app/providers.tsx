"use client"

import React, { ReactElement } from "react"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

interface props {
	children: ReactElement[]
	session: Session | null
}

export default function RootProviders({ children,session }: props) {
	return <SessionProvider session={session}>{children}</SessionProvider>
}
