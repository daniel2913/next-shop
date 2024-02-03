"use client"
import { useModalStore } from "@/store/modalStore"
import Cross from "@public/cross.svg"
import React from "react"

export default function ModalBase() {
	const dialogRef = React.useRef<HTMLDialogElement>(null)
	const {bindDialog,children,setContent}=useModalStore()
	React.useEffect(()=>bindDialog(dialogRef),[])
	return (
		<dialog
			onClose={()=>setContent(null)}
			ref={dialogRef}
			onClick={(e)=>{if (e.target === e.currentTarget) e.currentTarget.close()}}
			className={` 
				min-w-[20vw] max-w-[90vw] min-h-[30vh] max-h-[90vh]
				z-40 fixed
				rounded-md bg-secondary 
				border-secondary-foreground
			`}
		>
			<div className="z-40 absolute left-0 right-0 top-0 bottom-0">
			</div>
			<div className="z-50 relative p-5 flex justify-center items-center my-auto">
				{children}
			</div>
			<button
				type="button"
				onClick={()=>{dialogRef.current?.close()}}
				className="
				absolute z-50 right-0 top-0 h-5 w-5
				rounded-md bg-destructive
				"
			>
			<Cross width="20px" height="20px"/>
			</button>
		</dialog>
	)
}
