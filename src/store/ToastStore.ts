import { ServerErrorType } from "@/hooks/useAction"
import { create } from "zustand"

export type ToastState = {
	type: "error" | "info"
	title: string
	description: string
	isVisible: boolean
	info: (description: string, title?: string) => void
	error: (description: string, title?: string) => void
	isValidResponse: <T>(resp: T | ServerErrorType) => resp is T
}

export const useToastStore = create<ToastState>()((set, get) => ({
	isVisible: false,
	description: "",
	title: "",
	type: "error",
	info: (description, title) => {
		set({ isVisible: true, description, title, type: "info" })
		setTimeout(() => set({ isVisible: false }), 5000)
	},
	error: (description, title) => {
		set({ isVisible: true, description, title, type: "error" })
		setTimeout(() => set({ isVisible: false }), 5000)
	},
	isValidResponse: <T>(resp: T | ServerErrorType): resp is T => {
		if (resp && typeof resp === "object" && "error" in resp) {
			set({
				title: resp.title || "Server response",
				description: resp.error,
				type: "error",
				isVisible: true,
			})
			setTimeout(() => set({ isVisible: false }), 5000)
			return false
		}
		return true
	},
}))
