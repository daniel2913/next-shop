import { StateCreator } from "zustand"
import React  from "react"

export interface BaseModalSlice {
	children: React.ReactNode
	setContent: (content:React.ReactNode)=>void
	dialogRef: React.RefObject<HTMLDialogElement> |null
	bindDialog: (ref:React.RefObject<HTMLDialogElement>)=>void
}

export const createBaseModalSlice: StateCreator<BaseModalSlice> = (set,get) => ({
		dialogRef:null,
		children: null,
		setContent: (content)=>set({children:content}),
		bindDialog:(ref)=>set({dialogRef:ref}),
})
