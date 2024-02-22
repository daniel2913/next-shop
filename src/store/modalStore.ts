import { create } from "zustand"
import React from "react"

type ModalState = {
	children: React.ReactNode
	onClose: (val?: any) => any
	open: boolean
	title: string
	header: string
	forceWindow: boolean
	clear: (val?: any) => void
}
export const useModalStore = create<ModalState>()((set, get) => ({
	onClose: () => undefined,
	forceWindow: false,
	children: null,
	open: false,
	title: "",
	header: "",
	clear: (val) => {
		get().onClose(val)
		set(useModalStore.getInitialState())
	},
}))
