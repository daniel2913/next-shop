"use client"
import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle } from "@/components/UI/dialog"
import { useModalStore } from "@/store/modalStore"
import React from "react"




export default function ModalBase() {
	const {open,title,header,children,onClose}=useModalStore()
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
			<DialogHeader>{header}</DialogHeader>
			<DialogContent className="flex justify-center items-center w-fit h-fit max-h-[80vh] max-w-[80vw]">{children}</DialogContent>
			</DialogPortal>
		</Dialog>
	)}
			/* <div 
				onClick={()=>dialogRef.current?.close()}
				className="
				z-40 fixed left-0 right-0 top-0 bottom-0
				bg-black opacity-20 scale-[10]
			">
			</div>
			<div className="z-50 min-h-full min-w-full w-fit h-fit relative p-5 flex justify-center items-center my-auto">
				{children}
			</div>
			<button
				type="button"
				onClick={()=>{dialogRef.current?.close()}}
				className="
				nidden sm:fixed z-50 right-0 top-0 h-5 w-5
				rounded-md bg-destructive
				"
			>
			<Cross width="20px" height="20px"/>
			</button>
	)
} */
