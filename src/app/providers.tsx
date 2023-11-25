"use client"

import React, { ReactElement } from "react"
import { SessionProvider } from "next-auth/react"

interface props {
	children: ReactElement[]
}

export default function RootProviders({ children }: props) {
	return <SessionProvider>{children}</SessionProvider>
}
