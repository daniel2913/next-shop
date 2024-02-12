"use client"

import useResponsive from "@/hooks/useWidth"
import { Button } from "../button"
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer"
import React from "react"
import useModal from "@/hooks/modals/useModal"
import OrderIcon from "@public/note.svg"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Loading from "../Loading"

const Orders = dynamic(() => import("@/components/cart/Orders"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className: string
}
export default function OrderMenu(props: Props) {
	const mode = useResponsive()
	const session = useSession()
	const modal = useModal()
	const [drawerOpen, setDrawerOpen] = React.useState(false)
	return (
		mode === "desktop"
			?
			<Button
				className={`${props.className} flex gap`}
				variant="secondary"
				onClick={() =>
					session.data?.user
						? modal.show(
							<Loading>
								<Orders />
							</Loading>
						)
						: modal.show(
							<Loading>
								<Login />
							</Loading>
						)
				}>
				<OrderIcon className="p-1" height="30px" width="30px" /> Orders
			</Button>
			:
			<Drawer
				onOpenChange={setDrawerOpen}
				open={drawerOpen}
			>
				<DrawerTrigger onClick={() => setDrawerOpen(true)} className={`${props.className} flex relative basis-0 flex-auto flex-col items-center`}>
					<OrderIcon className="p-1" height="30px" width="30px" /> Orders
				</DrawerTrigger>
				<DrawerContent
					onSubmit={() => setDrawerOpen(false)}
					className="
							grid justify-center content-start w-full pb-14
							border-x-0 h-dvh bg-secondary
					">
					{
						session.data?.user
							?<Loading>
								<Orders />
							</Loading>
							: <Loading>
								<Login />
							</Loading>
					}
				</DrawerContent>
			</Drawer>
	)
}
