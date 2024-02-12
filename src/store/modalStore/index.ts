import { create } from "zustand"
import React from "react"

type ModalState = {
	children: React.ReactNode
	onClose: (val?: any) => any
	open: boolean
	title: string
	header: string
	clear: (val?: any) => void
}
export const useModalStore = create<ModalState>()((set, get) => ({
	onClose: () => undefined,
	children: null,
	open: false,
	title: "",
	header: "",
	clear: (val) => {
		get().onClose(val)
		set(useModalStore.getInitialState())
	}
}))

type ToastState = {
	children: React.ReactNode
	type: "error" | "info"
	title: string
	description: string
	isVisible: boolean
}

export const useToastStore = create<ToastState>()((set) => ({
	isVisible: false,
	description: "",
	title: "",
	type: "error",
}))

