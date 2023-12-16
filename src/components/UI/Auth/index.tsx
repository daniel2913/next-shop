"use client"
import Link from "next/link"
import useModalStore from "@/store/modalStore"
import { signOut, useSession } from "next-auth/react"
import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import dynamic from "next/dynamic"

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
	const reloadVotes = useProductStore(state=>state.reloadVotes)
	const modal = useModalStore((state) => state.base)
	return (
		<div className={`${className}`}>
			{session.data?.user?.name ? (
				<div className="grid">
					<Link href={`/profile/${name}`}>{name}</Link>
					<button
						type="submit"
						onClick={() => {
							signOut({ redirect: false }).then((res) => {
								purgeCart()
								reloadVotes()
							})
						}}
					>
						Log out
					</button>
				</div>
			) : (
				<div className="grid">
					<span>{name}</span>
					<button
						type="button"
						onClick={() => {
							modal.setModal(<Register close={modal.close} />)
							modal.show()
						}}
					>
						Register
					</button>
					<button
						type="button"
						onClick={async () => {
							modal.setModal(<Login reloadVotes={reloadVotes} close={modal.close} />)
							modal.show()
						}}
					>
						Log in
					</button>
				</div>
			)}
		</div>
	)
}
