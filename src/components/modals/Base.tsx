"use client"
import { useModalStore } from "@/store/modalStore"
import React, { useEffect } from "react"
import useResponsive from "@/hooks/useResponsive"
import { Drawer, DrawerContent, DrawerPortal, DrawerTitle } from "../ui/Drawer"
import Cross from "@public/cross.svg"
import { RemoveScroll } from "react-remove-scroll"

export default function ModalBase() {
	const { open, title, children, onClose, forceWindow, clear } = useModalStore()
	const ref = React.useRef<HTMLDialogElement>(null)
	const mode = useResponsive()
	useEffect(() => {
		if (open) {
			ref.current?.showModal()
		} else {
			ref.current?.close()
		}
	}, [open])
	if (forceWindow || mode === "desktop")
		return (
			<dialog
				className="relative rounded-md p-4"
				onClose={() => {
					onClose()
					clear()
				}}
				ref={ref}
				aria-modal
			>
				<button
					type="button"
					className="absolute right-1 top-1 rounded-sm bg-accent"
					onClick={() => {
						onClose()
						clear()
					}}
				>
					<Cross
						width={17}
						height={17}
						className="*:fill-foreground *:stroke-foreground"
					/>
				</button>
				<h2 className="text-center text-3xl font-bold capitalize">{title}</h2>
				<div
					onSubmit={() => {
						clear()
					}}
					className="flex h-fit max-h-[80vh] w-fit max-w-[95vw] items-center justify-center rounded-md p-2"
				>
					<RemoveScroll enabled={open}>{children}</RemoveScroll>
				</div>
			</dialog>
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
