'use client'
import Link from "next/link"
import { Session } from "next-auth"
import useModalStore from "@/store/modalStore"
import { signIn, signOut, useSession } from "next-auth/react"
import Register from "@/components/modals/Register"
import useCartStore from "@/store/cartStore"
import useFetchCart from "@/hooks/fetchCart"

interface props {
	className?: string
}

export default function Auth({ className }: props) {
	const session = useSession()
	
	const name = session.data?.user?.name ? session.data?.user?.name : "Guest"
	const cartSetter = useCartStore(state=>state.setItems)
	const fetchCart = useFetchCart()
	const purgeCart = ()=>cartSetter([])
	const modal = useModalStore(state=>state.base)
	const register = (<Register/>)
	return (
		<div className={`${className}`}>
			{session.data?.user?.name ? (
				<div className="grid">
					<Link href={`/profile/${name}`}>{name}</Link>
					<button onClick={()=>{signOut({redirect:false});purgeCart()}}>Log out</button>
				</div>
			) : (
				<div className="grid">
					<span>{name}</span>
					<button onClick={()=>{modal.setModal(register);modal.show()}}>Register</button>
					<button onClick={()=>{signIn('credentials',{name:'test',password:'test',redirect:false}).then(res=>{if (res?.ok)fetchCart()})}}>Log in</button>
				</div>
			)}
		</div>
	)
}
