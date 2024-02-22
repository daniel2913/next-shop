import React from "react"
import { useModalStore } from "@/store/modalStore"
import ModalConfirm from "@/components/modals/Confirm"

export default function useConfirm(defaultMessage = "Are you sure?") {
	const clear = useModalStore((state) => state.clear)
	function show(message?: string) {
		return new Promise((res) => {
			useModalStore.setState({
				children: (
					<ModalConfirm
						resolver={(val: boolean) => {
							res(val)
							clear()
						}}
						message={message || defaultMessage}
					/>
				),
				open: true,
				title: "Confirmation",
				forceWindow: true,
				header: "Are you sure?",
				onClose: () => res(false),
			})
		})
	}
	return show
}
