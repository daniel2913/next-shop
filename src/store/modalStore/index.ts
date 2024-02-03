import { create } from "zustand"
import React from "react"

interface ModalState {
	children: React.ReactNode
	setContent: (content:React.ReactNode)=>void
	dialogRef: React.RefObject<HTMLDialogElement> |null
	bindDialog: (ref:React.RefObject<HTMLDialogElement>)=>void
}
export const useModalStore = create<ModalState>()((set) => ({
		dialogRef:null,
		children: null,
		setContent: (content)=>set({children:content}),
		bindDialog:(ref)=>set({dialogRef:ref}),
}))

interface ToastState {
	children: React.ReactNode
	type:"error"|"info"
	title:string
	description:string
	isVisible:boolean
}

export const useToastStore = create<ToastState>()((set) => ({
		isVisible:false,
		description: "",
		title:"",
		type:"error",
}))

