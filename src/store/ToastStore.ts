import { create } from "zustand"

export const useToastStore = create<ToastState>()(() => ({
	isVisible: false,
	description: "",
	title: "",
	type: "error",
}))
type ToastState = {
	type: "error" | "info"
	title: string
	description: string
	isVisible: boolean
}
