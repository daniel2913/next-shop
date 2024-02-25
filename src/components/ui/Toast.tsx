"use client"

import React from "react"
import Exclaimation from "@/../public/exclaim.svg"
import Info from "@/../public/info.svg"
import { useToastStore } from "@/store/ToastStore"
import { Alert, AlertTitle, AlertDescription } from "./Alert"

export default function Toast() {
	const { isVisible, description, title, type } = useToastStore()
	const Icon = type === "error" ? Exclaimation : Info
	return (
		<Alert
			onClick={() => useToastStore.setState({ isVisible: false })}
			className={`
				${type === "error" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"}
				${isVisible ? "block" : "hidden"}
				md:max-h-1/3 md:max-w-1/4
				fixed bottom-12 left-0 right-0 z-[100] h-1/4
				animate-slide-up transition-transform duration-300 md:bottom-2 md:left-auto md:right-2
				md:h-48 md:w-96
				md:translate-x-0
			`}
		>
			<AlertTitle className="mb-4 text-2xl">
				<Icon
					className="relative left-0 top-0 inline"
					width="40px"
					height="40px"
				/>
				{title}
			</AlertTitle>
			<AlertDescription className="text-xl">{description}</AlertDescription>
		</Alert>
	)
}
