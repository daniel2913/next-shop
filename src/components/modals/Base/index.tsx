"use client"
import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle } from "@/components/UI/dialog"
import { useModalStore } from "@/store/modalStore"
import React from "react"

export default function ModalBase() {
	const {open,title,children,onClose}=useModalStore()
	return (
		<Dialog
			open={open}
			onOpenChange={(open)=>{
				useModalStore.setState({open})
				if (!open) onClose()
			}}
		>
			<DialogPortal>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent className="flex justify-center items-center w-fit h-fit max-h-[80vh] max-w-[80vw]">{children}</DialogContent>
			</DialogPortal>
		</Dialog>
	)}
