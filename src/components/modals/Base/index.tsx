"use client"
import useModalStore from "@/store/modalStore"

import React from "react"

export default function ModalBase() {
	const { isVisible, content, close } = useModalStore(
		(state) => state.base
	)
	return (
		<dialog
			className={`
            ${isVisible ? "block" : "hidden"}
            max-w-70% absolute bottom-1/2 right-1/2 h-[33vh]
            max-h-full min-h-fit w-[33vw]
            min-w-fit translate-x-1/2 translate-y-1/2
            rounded-md bg-cyan-100 p-4
            
            `}
		>
			<button
				type="button"
				onClick={close}
				className="
				absolute right-0 top-0 h-4 w-4
				rounded-md bg-accent1-500
				"
			></button>
			{content}
		</dialog>
	)
}
