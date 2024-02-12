"use client"
import Exit from "@/../public/exit.svg"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import { signOut, useSession } from "next-auth/react"
import React from "react"
import { Button } from "../button"
import { useRouter } from "next/navigation"


type Props = {
	className?: string
}

export function ReloadOnUserChange(){
	const router = useRouter()
	const session = useSession()
	React.useEffect(()=>{
		router.refresh()
	}
	,[session])
	return null
}

export function ProductControl() {
	const session = useSession()
	const reload = useProductStore(state => state.reload)
	React.useEffect(() => {
		reload()
		if (!session.data?.user)
			useCartStore.setState({ items: {} })

	}, [session.data?.user, reload])
	return null
}

export default function Auth({ className }: Props) {
	return (
		<>
			<Button
				className="p-1"
				variant="destructive"
				type="submit"
				onClick={async () => {
					await signOut({ redirect: false })
				}}
			>
				<Exit className="stroke-2" height="30px" width="30px" />
			</Button>
		</>
	)
}
