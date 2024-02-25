import { create } from "zustand"
import React from "react"

type ModalState = {
	children: React.ReactNode
	onClose: (val?: any) => any
	open: boolean
	title: string
	forceWindow: boolean
	clear: (val?: any) => void
	show: (
		children: React.ReactNode,
		title?: string,
		forceWindow?: boolean
	) => Promise<any>
}
export const useModalStore = create<ModalState>()((set, get) => ({
	show: (children, title, forceWindow) => {
		return new Promise((resolve) =>
			set({
				children,
				open: true,
				title,
				forceWindow,
				onClose: () => resolve(false),
			})
		)
	},
	onClose: () => undefined,
	forceWindow: false,
	children: null,
	open: false,
	title: "",
	clear: (val) => {
		get().onClose(val)
		set((s) => ({
			...s,
			open: false,
			title: "",
			children: null,
			forceWindow: false,
		}))
	},
}))
