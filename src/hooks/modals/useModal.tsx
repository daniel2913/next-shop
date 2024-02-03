import {useModalStore} from "../../store/modalStore"
import React from "react"

export default function useModal() {
	const {dialogRef,setContent} = useModalStore()
	
	function show(Modal: React.ReactNode) {
		if (dialogRef?.current){
			setContent(Modal)
			dialogRef.current.showModal()
		}
		else (
			console.error("NO MODAL?")
		)
		let resolve:(val:any)=>void
		const res = new Promise((res)=>{resolve=res})
		dialogRef?.current?.addEventListener("close",()=>resolve(1))
		return res
	}
	
	function close(val?:any) {
		setContent(null)
		dialogRef?.current?.close()
	}

	return {show, close}
}
