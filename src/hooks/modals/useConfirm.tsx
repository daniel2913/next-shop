import useModalStore from "@/store/modalStore"
import { ModalConfirm } from "@/components/modals"
import { useEffect, useRef } from "react"

export default function useConfirm(message = "Are you sure?") {
	const modalState = useModalStore((state) => state.base)
	const confirmModalState = useModalStore(
		(state) => state.confirm
	)
	const answer = useRef<(ans: boolean) => void>()

	function show() {
		modalState.setModal(<ModalConfirm message={message} />)
		modalState.show()
		return new Promise((resolve) => {
			answer.current = resolve
		})
	}

	useEffect(() => {
		if (answer.current && confirmModalState.answer != null) {
			answer.current(confirmModalState.answer)
			confirmModalState.reset()
			modalState.close()
		}
	}, [confirmModalState, modalState])

	return show
}
