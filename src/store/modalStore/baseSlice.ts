import { StateCreator } from "zustand"
import React, { ReactElement } from "react"

export interface BaseModalSlice {
	base: {
		isVisible: boolean
		content: ReactElement | null
		show: () => void
		close: () => void
		setModal: (newContent: React.ReactElement) => void
	}
}

export const createBaseModalSlice: StateCreator<
	BaseModalSlice
> = (set) => ({
	base: {
		isVisible: false,
		content: null,
		show: () =>
			set((state) => ({
				base: { ...state.base, isVisible: true },
			})),
		close: () =>
			set((state) => ({
				base: { ...state.base, isVisible: false },
			})),
		setModal: (newContent) =>
			set((state) => ({
				base: { ...state.base, content: newContent },
			})),
	},
})
