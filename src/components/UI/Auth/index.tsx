"use client"
import Link from "next/link"
import useModalStore from "@/store/modalStore"
import { signIn, signOut, useSession } from "next-auth/react"
import Register from "@/components/modals/Register"
import useCartStore from "@/store/cartStore"
import useLogin from "@/hooks/modals/useLogin"
import Login from "@/components/modals/Login"
import { useRouter } from "next/navigation"

interface props {
	className?: string
}

export default function Auth({ className }: props) {
	const session = useSession()
	console.log(session)

	const name = session.data?.user?.name
		? session.data?.user?.name
		: "Guest"
	const cartSetter = useCartStore((state) => state.setItems)
	const router = useRouter()
	const purgeCart = () => cartSetter({})
	const modal = useModalStore((state) => state.base)
	const register = <Register />
	const login = <Login close={modal.close} />
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
								router.refresh()
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
							modal.setModal(register)
							modal.show()
						}}
					>
						Register
					</button>
					<button
						type="button"
						onClick={() => {
							modal.setModal(login)
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
