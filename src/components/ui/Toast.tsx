"use client"

import React from "react"
import Exclaimation from "@/../public/exclaim.svg"
import Info from "@/../public/info.svg"
import { useToastStore } from "@/store/modalStore"
import { Alert, AlertTitle,AlertDescription } from "./Alert"


export default function Toast(){
	const {isVisible,description,title,type} = useToastStore()
	const Icon = type === "error" ? Exclaimation : Info
	return(
		<Alert
			onClick={()=>useToastStore.setState({isVisible:false})}
			className={`
				${type==="error" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"}
				${isVisible ? "block" : "hidden"}
				fixed animate-slide-up
				md:h-48 md:w-96 bottom-12 left-0 right-0 h-1/4
				md:max-h-1/3 md:max-w-1/4 md:left-auto md:right-2 md:translate-x-0 md:bottom-2
				transition-transform z-[90]
				duration-300
			`}
		>
			<AlertTitle className="mb-4 text-2xl">
				<Icon className="relative inline top-0 left-0" width="40px" height="40px"/>
				{title}
			</AlertTitle>
			<AlertDescription className="text-xl">
				{description}
			</AlertDescription>
		</Alert>
	)
}
