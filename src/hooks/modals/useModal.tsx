import {useModalStore} from "../../store/modalStore"
import React from "react"

export default function useModal() {
	const {dialogRef,setContent} = useModalStore(state=>state)

	function show(Modal: React.ReactElement) {
		if (dialogRef?.current){
			setContent(Modal)
			dialogRef.current.showModal()
		}
		else (
			console.error("NO MODAL?")
		)
	}
	function close() {
		setContent(null)
		dialogRef?.current?.close()
	}

	return { show, close}
}
