import {useToastStore} from "../../store/modalStore"
import React from "react"

export default function useToast() {
	const {setContent,show:_show,close:_close} = useToastStore()

	function show(Modal: React.ReactElement|string) {
		setContent(Modal)
		_show()
		setTimeout(()=>_close(),2000)
	}
	return {show}
}
