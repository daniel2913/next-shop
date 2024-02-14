"use client"

import React from "react"
import Exclaimation from "@/../public/exclaim.svg"
import Info from "@/../public/info.svg"
import { useToastStore } from "@/store/modalStore"
import { Alert, AlertTitle,AlertDescription } from "../alert"


export default function Toast(){
	const {isVisible,description,title,type} = useToastStore()
	const Icon = type === "error" ? Exclaimation : Info
	return(
		<Alert
			className={`
				${type==="error" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"}
				${isVisible ? "block" : "hidden"}
				fixed animate-slide-up
				h-1/6 w-1/2 right-1/2 md:bottom-0 bottom-12
				md:h-1/4 md:w-1/5 md:right-4
				transition-transform z-[90]
				duration-300
			`}
		>
			<AlertTitle>
			<span>
				<Icon width="30px" height="30px"/> {title}
			</span>
			</AlertTitle>
			<AlertDescription>
				{description}
			</AlertDescription>
		</Alert>
	)
}
