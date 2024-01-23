"use client"

import useToast from "@/hooks/modals/useToast"
import React from "react"
import Exclaimation from "@/../public/exclaim.svg"
import Info from "@/../public/info.svg"

type Props = {
	type:"error"|"info"
}

export default function Toast(props:Props){
	if (!props.type) props.type="error"
	const Icon = props.type === "error" ? Exclaimation : Info
	const {isVisible, content} = useToast()
	return(
		<div
			className={`
				${props.type === "error" ? "bg-accent1-300" : "bg-cyan-300" }
				rounded-t-md
				fixed
				h-1/6 w-1/2
				md:h-1/4 md:w-1/5 
				bottom-0 right-1/2 translate-x-1/2
				md:right-2 md:translate-x-0
				transition-transform z-50
				duration-300
				flex justify-center items-center
				translate-y-full ${ isVisible && "translate-y-0"}
			`}
		>
			{content}
		</div>
	)
}
