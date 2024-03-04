import ModalBase from "@/components/modals/Base"
import { create } from "zustand"

export const ModalState = {
	open: true,
	children: <>This is test</>
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

let _ModalState
export function useModalStore(selector?: (val: any) => any) {
	const state = {
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
		open: true,
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
		..._ModalState
	}
	return selector ? selector(state) : state
}

export function ModalDecorator(Story, { parameters }) {
	if (parameters?.ModalState)
		useModalStore.setState(parameters.ModalState)
	_ModalState = parameters.ModalState
	return (
		<>
			<Story />
			<ModalBase />
		</>
	)
}
