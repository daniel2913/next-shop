"use client"

import React from "react"
import Exclaimation from "@/../public/exclaim.svg"
import Info from "@/../public/info.svg"
import { useToastStore } from "@/store/modalStore"

type Props = {
	type:"error"|"info"
}

export default function Toast(props:Props){
	if (!props.type) props.type="error"
	const {isVisible,children} = useToastStore()
	const Icon = props.type === "error" ? Exclaimation : Info
	return(
		<div
			className={`
				${props.type === "error" ? "bg-accent1-300" : "bg-cyan-300" }
				${isVisible ? "translate-y-0" : "translate-y-full"}
				rounded-t-md fixed
				h-1/6 w-1/2 right-1/2 bottom-0
				md:h-1/4 md:w-1/5 md:right-4
				transition-transform z-50
				duration-300
			`}
		>
			{children}
		</div>
	)
}
