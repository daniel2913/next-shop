"use client"
import Exit from "@/../public/exit.svg"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import { signOut, useSession } from "next-auth/react"
import React from "react"
import { Button } from "../button"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Admin from "@public/admin.svg"
import { global } from "styled-jsx/css"

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
	const skip = React.useRef(session.data?.user?.id)
	React.useEffect(() => {
		console.log(session.data?.user?.id)
		if (session.data?.user?.id!==skip.current){
			console.log(skip.current, "reload for ",session.data?.user?.id)
			skip.current=session.data?.user?.id
			reload()
			if (!session.data?.user)
				useCartStore.setState({ items: {} })
		}

	}, [session.data?.user, reload])
	return null
}

export default function Auth({ className }: Props) {
	const session = useSession()
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
			{session.data?.user?.role==="admin"
			?
				<Link className="" href={"/admin/products"}>
				<Button 
					className="p-1"
					type="button"
					variant="link"
					>
					<Admin width="30px" height="30px"/>
				</Button>
				</Link>
			: null
			}
		</>
	)
}
