"use client"

import React from "react"
import useModal from "@/hooks/modals/useModal"
import OrderIcon from "@public/note.svg"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Loading from "@/components/ui/Loading"
import NavButton from "./Navbutton"

const Orders = dynamic(() => import("@/components/order/Orders"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className: string
}
export default function OrderMenu(props: Props) {
	const session = useSession()
	const modal = useModal()
	return (
				<NavButton 
					onClick={() => modal.show(<Loading>{session?.data?.user ? <Orders/> : <Login close={modal.close}/>}</Loading>)}
					className={props.className}
				>
					<OrderIcon className="*:stroke-foreground *:fill-foreground *:stroke-2:w" height="30px" width="30px" /> 
					Orders
				</NavButton>
	)
}
