import useModalStore from "../../store/modalStore"
import React, { ReactElement } from "react"

export default function useModal<T>() {
	const modalState = useModalStore((state) => state.base)
	const answer =
		React.useRef<(res: T | null | Promise<T | null>) => void>()

	function show(Modal: ReactElement) {
		modalState.setModal(Modal)
		modalState.show()
		return new Promise<T | null>((resolve) => {
			answer.current = resolve
		})
	}
	function resolve(data: any) {
		if (answer.current) answer.current(data)
		modalState.close()
	}
	function close() {
		if (answer.current) answer.current(null)
		modalState.close()
	}

	return { show, close, resolve }
}
