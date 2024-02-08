"use client"
import { signOut, useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import dynamic from "next/dynamic"
import { Button } from "../button"
import Exit from "@/../public/exit.svg"
import useModal from "@/hooks/modals/useModal"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Orders from "@public/note.svg"
import useResponsive from "@/hooks/useWidth"
import Link from "next/link"
import React from "react"

const OrderList = dynamic(() => import("@/components/cart/Orders"))

interface props {
	className?: string
}

export function ProductControl(){
	const session = useSession()
	const {reload} = useProductStore.getState()
	React.useEffect(()=>{
		reload()
		if (!session.data?.user)
			useCartStore.setState({items:{}})

	},[session.data?.user])
	return null
}

export default function Auth({ className }: props) {
	const session = useSession()
	const mode = useResponsive()
	const modal = useModal()
	return (
		<>
			{session.data?.user?.name
				?
				<>
					{mode==="desktop"
					?
					<Button
						className="flex gap-2"
						variant="secondary"
						onClick={() => modal.show(<OrderList />)}>
						<Orders className="p-1" height="30px" width="30px" /> Orders
					</Button>
					:
					<Link
						href="/shop/orders"
						className="flex flex-col items-center"
					>
						<Orders className="p-1" height="30px" width="30px" /> Orders
					</Link>
					}
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
				:	null			
			}
		</>
	)
}
