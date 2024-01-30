"use client"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import dynamic from "next/dynamic"
import Image from "next/image"
import Exit from "@/../public/exit.svg"
import useModal from "@/hooks/modals/useModal"
import { useRouter } from "next/navigation"
const Login = dynamic(() => import("@/components/modals/Login"))

interface props {
	className?: string
}

export default function Auth({ className}: props) {
	const session = useSession()
	const router = useRouter()
	const name = session.data?.user?.name ? session.data?.user?.name : "Guest"
	const cartSetter = useCartStore((state) => state.setItems)
	const purgeCart = () => cartSetter({})
	const reloadProducts = useProductStore(state=>state.reload)
	const modal = useModal()
	return (
		<div className={`${className}`}>
			{session.data?.user?.name ? (
				<div className="flex gap-2 align-items-center">
					<h6>{name}</h6>
					<button
						type="submit"
						onClick={() => {
							signOut({ redirect: false }).then((res) => {
								purgeCart()
								reloadProducts()
								router.refresh()
							})
						}}
					>
						<Exit className="stroke-accent1-400" height="30px" width="30px"/>
					</button>
				</div>
			) : (
				<div className="grid">
					<span>{name}</span>
					<button
						type="button"
						onClick={async () => {
							modal.show(<Login reloadProducts={reloadProducts} close={modal.close} />)
						}}
					>
						Log in
					</button>
				</div>
			)}
		</div>
	)
}
