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
	setContent: (content:React.ReactNode)=>void
	show:()=>void
	close:()=>void
	isVisible:boolean
}

export const useToastStore = create<ToastState>()((set) => ({
		isVisible:false,
		children: null,
		setContent: (content)=>set({children:content}),
		show:()=>set({isVisible:true}),
		close:()=>set({isVisible:false})
}))

