"use client"

import React from "react"
import useModal from "@/hooks/modals/useModal"
import OrderIcon from "@public/note.svg"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Loading from "@/components/ui/Loading"
import NavButton from "./Navbutton"
import useAction from "@/hooks/useAction"
import { getOrderNotificationsAction } from "@/actions/order"

const Orders = dynamic(() => import("@/components/order/Orders"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className: string
}
export default function OrderMenu(props: Props) {
	const session = useSession()
	const modal = useModal()
	const {value:notifs,reload} = useAction(getOrderNotificationsAction,0)
	React.useEffect(()=>{
	reload()
	},[session])
	return (
				<NavButton 
					onClick={() => modal.show(<Loading>{session?.data?.user ? <Orders/> : <Login close={modal.close}/>}</Loading>).then(_=>reload())}
					className={props.className}
				>
					<div className="w-fit h-fit relative">
					<OrderIcon className="*:stroke-foreground *:fill-foreground *:stroke-2:w" height="30px" width="30px" /> 
				{
					notifs
						?
						<div className="
						absolute overflow-hidden 
						-top-4 left-1/2 text-lg
						md:-top-1/3 md:-right-1/2
						w-6 aspect-square rounded-full bg-accent border-tan border-1
					">
							<span className="absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								{notifs}
							</span>
						</div>
						: null
				}
					</div>
					Orders
				</NavButton>
	)
}
