"use client"

import React from "react"
import OrderIcon from "@public/note.svg"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import NavButton from "../ui/Navbutton"
import useAction from "@/hooks/useAction"
import { getOrderNotificationsAction } from "@/actions/order"
import { useRouter } from "next/navigation"
import { useModalStore } from "@/store/modalStore"

const Login = dynamic(() => import("@/components/modals/auth"))

type Props = {
	className: string
}
export default function OrderMenu(props: Props) {
	const { value: notifs } = useAction(getOrderNotificationsAction, 0)
	const session = useSession()
	const show = useModalStore((s) => s.show)
	const close = useModalStore((s) => s.clear)
	const router = useRouter()
	return (
		<NavButton
			className={`${props.className} relative !flex-col !gap-0`}
			aria-label="go to orders list"
			onClick={() =>
				session.data?.user?.role === "user"
					? router.push("/shop/orders")
					: show(<Login close={() => close()} />)
			}
		>
			<div className="relative h-fit w-fit">
				<OrderIcon
					className="*:stroke-2:w *:fill-foreground *:stroke-foreground"
					height="30px"
					width="30px"
				/>
				{notifs ? (
					<div className="border-tan border-1 absolute -top-4 left-1/2 aspect-square w-6 overflow-hidden rounded-full bg-accent text-lg md:-right-1/2 md:-top-1/3">
						<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
							{notifs}
						</span>
					</div>
				) : null}
			</div>
			Orders
		</NavButton>
	)
}
