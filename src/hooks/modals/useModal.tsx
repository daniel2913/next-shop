import {useModalStore} from "../../store/modalStore"
import React from "react"

export default function useModal() {
	const {dialogRef,setContent} = useModalStore(state=>state)
	const resolve = React.useRef<(val?:any)=>void>()
	const closed = React.useRef(new Promise((res)=>{resolve.current=res}))
	
	function show(Modal: React.ReactNode) {
		if (dialogRef?.current){
			setContent(Modal)
			dialogRef.current.showModal()
		}
		else (
			console.error("NO MODAL?")
		)
		closed.current = new Promise((res)=>{resolve.current=res})
		dialogRef?.current?.addEventListener("close",()=>{alert("test");console.log(resolve.current,closed.current);resolve.current?.()})
		return closed
	}
	
	function close(val?:any) {
		setContent(null)
		debugger
		resolve.current?.(val||true)
		dialogRef?.current?.close()
	}

	return {show, close}
}
