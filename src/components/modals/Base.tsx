"use client"
import { useModalStore } from "@/store/modalStore"
import React from "react"
import { Dialog, DialogContent, DialogPortal, DialogTitle } from "../ui/Dialog"
import useResponsive from "@/hooks/useResponsive"
import { Drawer, DrawerContent, DrawerPortal, DrawerTitle } from "../ui/Drawer"

export default function ModalBase() {
	const { open, title, children, onClose, forceWindow, clear } = useModalStore()
	const mode = useResponsive()
	if (forceWindow || mode === "desktop")
		return (
			<Dialog
				open={open}
				onOpenChange={(open) => {
					useModalStore.setState({ open })
					if (!open) clear()
				}}
			>
				<DialogPortal>
					<DialogTitle>{title}</DialogTitle>
					<DialogContent
						onSubmit={() => {
							clear()
						}}
						className="flex justify-center items-center w-fit h-fit max-h-[80vh] max-w-[95vw]"
					>
						{children}
					</DialogContent>
				</DialogPortal>
			</Dialog>
		)
	return (
		<Drawer
			open={open}
			onOpenChange={(open) => {
				useModalStore.setState({ open })
				if (!open) clear()
			}}
		>
			<DrawerPortal>
				<DrawerTitle>{title}</DrawerTitle>
				<DrawerContent
					onSubmit={() => {
						clear()
					}}
					className="
						flex  items-center content-start w-full px-4 pb-10
						border-x-0 h-dvh bg-secondary 
					">
					{children}
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	)
}
