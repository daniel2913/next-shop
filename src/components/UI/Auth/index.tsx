"use client"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import dynamic from "next/dynamic"
import Image from "next/image"
import Exit from "@/../public/exit.svg"
import useModal from "@/hooks/modals/useModal"
const Login = dynamic(() => import("@/components/modals/Login"))
const Register = dynamic(() => import("@/components/modals/Register"))

interface props {
	className?: string
}

export default function Auth({ className}: props) {
	const session = useSession()
	const name = session.data?.user?.name ? session.data?.user?.name : "Guest"
	const cartSetter = useCartStore((state) => state.setItems)
	const purgeCart = () => cartSetter({})
	const reloadProducts = useProductStore(state=>state.reload)
	const modal = useModal()
	return (
		<div className={`${className}`}>
			{session.data?.user?.name ? (
				<div className="flex gap-2 align-items-center">
					<Link href={`/profile/${name}`}>
					<Image
						width={30}
						alt="Avatar"
						height={30}
						className="rounded-full"
						src={`/users/${session.data.user.image || "template.jpg"}`}
					/>
					<h6>{name}</h6>
					</Link>
					<button
						type="submit"
						onClick={() => {
							signOut({ redirect: false }).then((res) => {
								purgeCart()
								reloadProducts()
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
						onClick={() => {
							modal.show(<Register/>)
						}}
					>
						Register
					</button>
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
