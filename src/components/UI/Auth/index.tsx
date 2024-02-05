"use client"
import { signOut, useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import dynamic from "next/dynamic"
import { Button } from "../button"
import Exit from "@/../public/exit.svg"
import useModal from "@/hooks/modals/useModal"
import { useRouter } from "next/navigation"
import Orders from "@public/note.svg"
import useResponsive from "@/hooks/useWidth"
import Link from "next/link"

const OrderList = dynamic(() => import("@/components/cart/Orders"))

interface props {
	className?: string
}

export default function Auth({ className }: props) {
	const session = useSession()
	const router = useRouter()
	const mode = useResponsive()
	const cartSetter = useCartStore((state) => state.setItems)
	const purgeCart = () => cartSetter({})
	const reloadProducts = useProductStore(state => state.reload)
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
							purgeCart()
							reloadProducts()
							router.refresh()
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
