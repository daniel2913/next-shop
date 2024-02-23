"use client"

import React from "react"
import { Drawer, DrawerContent, DrawerPortal, DrawerTitle } from "../ui/Drawer"
import { useModalStore } from "@/store/modalStore"


export default function MobileModal(){
	const { open, title, children, onClose, clear } = useModalStore()
	return(
		<Drawer
			open={open}
			onOpenChange={(open) => {
				useModalStore.setState({ open })
				if (!open) clear()
			}}
			onClose={onClose}
		>
			<DrawerPortal>
				<DrawerTitle className="text-center text-2xl font-bold capitalize">
					{title}
				</DrawerTitle>
				<DrawerContent
					onSubmit={() => {
						clear()
					}}
					className="flex h-dvh w-full content-start items-center border-x-0 bg-background px-4 pb-10 "
				>
					{children}
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	)
}
