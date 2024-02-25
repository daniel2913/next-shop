import React from "react"
import { useModalStore } from "@/store/modalStore"
import ModalConfirm from "@/components/modals/Confirm"

export default function useConfirm(defaultMessage = "Are you sure?") {
	const show = React.useCallback(
		(message?: string) => {
			return new Promise((res) => {
				useModalStore.setState({
					children: (
						<ModalConfirm
							resolver={(val: boolean) => {
								res(val)
								useModalStore.getState().clear()
							}}
							message={message || defaultMessage}
						/>
					),
					open: true,
					title: "Confirmation",
					forceWindow: true,
					onClose: () => res(false),
				})
			})
		},
		[defaultMessage]
	)
	return show
}
