"use client"
import useModalStore from "@/store/modalStore"
import { useRouter } from "next/navigation"

import React, { ReactElement } from "react"

type Props = {
	childrend: ReactElement[]
}

export default function ModalBase({children}:Props) {
	const router = useRouter()
	console.log("Rendering")
	const close = ()=>router.replace('null')
	return (
		<dialog
			className={`
            ${children!==null ? "block" : "hidden"}
            absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2
            min-w-fit max-w-70% w-[33vw]
            min-h-fit max-h-full h-[33vh]
            bg-cyan-100 p-4 rounded-md
            `}
		>
			<button
				type="button"
				onClick={close}
				className="
				absolute h-4 w-4 right-0 top-0
				bg-accent1-500 rounded-md
				" 
			>
			</button>
			{children}
		</dialog>
	)
}

