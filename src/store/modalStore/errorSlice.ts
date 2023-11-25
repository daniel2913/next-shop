import { StateCreator } from "zustand"

export interface ModalConfirmSlice {
	confirm: {
		answer: boolean | null
		accept: () => void
		reject: () => void
		reset: () => void
	}
}

export const createModalConfirmSlice: StateCreator<ModalConfirmSlice> = (
	set,
) => ({
	confirm: {
		answer: null,
		accept: () =>
			set((state) => ({ confirm: { ...state.confirm, answer: true } })),
		reject: () =>
			set((state) => ({ confirm: { ...state.confirm, answer: false } })),
		reset: () =>
			set((state) => ({ confirm: { ...state.confirm, answer: null } })),
	},
})
