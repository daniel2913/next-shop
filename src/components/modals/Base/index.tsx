"use client"
import { useModalStore } from "@/store/modalStore"

import React from "react"

export default function ModalBase() {
	const dialogRef = React.useRef<HTMLDialogElement>(null)
	const {bindDialog,children,setContent}=useModalStore()
	React.useEffect(()=>bindDialog(dialogRef),[])
	return (
		<dialog
			onClose={()=>setContent(null)}
			ref={dialogRef}
			className={`
				fixed bottom-1/2 right-1/2  
				z-50
				translate-x-1/2 translate-y-1/2
				rounded-md bg-cyan-100 p-4
				`}
		>
			<button
				type="button"
				onClick={()=>{dialogRef.current?.close()}}
				className="
				absolute right-1 top-1 h-4 w-4
				rounded-md bg-accent1-500
				"
			></button>
			{children}
		</dialog>
	)
}
