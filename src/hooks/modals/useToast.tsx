import {useToastStore} from "../../store/modalStore"
import React from "react"

export default function useToast() {

	const setContent = useToastStore(state=>state.setContent)
	const _show= useToastStore(state=>state.show)
	const _close= useToastStore(state=>state.close)
	
	function show(Modal: React.ReactElement|string) {
		setContent(Modal)
		_show()
		setTimeout(()=>_close(),10000)
	}
	return {show}
}
