"use client"
import useModalStore from "@/store/modalStore"

import React from "react"

export default function ModalBase() {
	const { isVisible, content, close } = useModalStore((state) => state.base)
	return (
		<dialog
			className={`
            ${isVisible ? "block" : "hidden"}
            absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2
            min-w-fit max-w-lg w-[33vw]
            min-h-fit max-h-lg h-[33vh]
            bg-cyan-100 p-8
            
            `}
		>
			<button
				onClick={close}
				className=" aspect-square relative right-0 text-xl  border border-gray-600 text-accent1-300"
			>
				X
			</button>
			{content}
		</dialog>
	)
}
