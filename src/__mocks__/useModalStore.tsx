import ModalBase from "@/components/modals/Base"
import { create } from "zustand"

export const ModalState = {
		open:true,
		children:<>This is test</>
}

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

console.log("THIS IS LOADED")
let _ModalState
export const useModalStore = create<ModalState>()((set, get) => ({
	show: (children, title, forceWindow) => {
		return new Promise((resolve) =>
			set({
				children,
				open: true,
				..._ModalState,
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


export function ModalDecorator (Story,{parameters}){
	if (parameters?.ModalState)
		_ModalState = parameters.ModalState
	return (
	<>
	<Story/>
	<ModalBase/>
	</>
	)
}
