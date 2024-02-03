"use client"
import { signOut, useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import dynamic from "next/dynamic"
import { Button } from "../button"
import Exit from "@/../public/exit.svg"
import useModal from "@/hooks/modals/useModal"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import Orders from "@public/note.svg"

const Login = dynamic(() => import("@/components/modals/Login"))
const OrderList = dynamic(()=> import("@/components/cart/Orders"))

interface props {
	className?: string
}

export default function Auth({ className }: props) {
	const session = useSession()
	const router = useRouter()
	const name = session.data?.user?.name ? session.data?.user?.name : "Guest"
	const cartSetter = useCartStore((state) => state.setItems)
	const purgeCart = () => cartSetter({})
	const reloadProducts = useProductStore(state => state.reload)
	const modal = useModal()
	return (
		<div className={className}>
			{session.data?.user?.name 
				? 
					<Popover>
					<PopoverTrigger>
						{name}
					</PopoverTrigger>
					<PopoverContent
						className="flex p-2"
						>
					<Button
						className="px-2"
						variant="secondary"
						onClick={()=>modal.show(<OrderList/>)}>
						<Orders className="mr-2" height="30px" width="30px"/> Orders
					</Button>
					<Button
						className="ml-auto px-2"
						variant="destructive"
						type="submit"
						onClick={async () => {
								await signOut({ redirect: false })
								purgeCart()
								reloadProducts()
								router.refresh()
						}}
					>
						<Exit className="stroke-2" height="30px" width="30px"/>
					</Button>
					</PopoverContent>
					</Popover>
			 : 
				<Button
					className="px-2"
					variant="secondary"
					type="button"
					onClick={async () => {
						modal.show(<Login reloadProducts={reloadProducts} close={modal.close} />)
					}}
				>
					Log in
				</Button>
			}
		</div>
	)
}
