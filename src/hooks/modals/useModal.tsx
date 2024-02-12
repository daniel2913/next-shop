import { useModalStore } from "../../store/modalStore"
import React from "react"

export default function useModal() {
	const clear = useModalStore(state=>state.clear)
	function show(children: React.ReactNode, title = "", header = "") {
		return new Promise((res) => {
			useModalStore.setState({ children, title, header, open: true, onClose:res })
		})
	}

	function close(val?: any) {
		clear(val)
	}

	return { show, close }
}
