"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type Props = {
	children: React.ReactNode
	admin?: boolean
	onUnAuth?: () => void
}

export default function RequireAuth(props: Props) {
	const router = useRouter()
	const session = useSession({
		required: true, onUnauthenticated() {
			router.push("/shop/home")
			if (props.onUnAuth) return props.onUnAuth()
		},
	})
	if (props.admin && session.data?.user?.role !== "admin")
		throw "No admin"
	return props.children
}
