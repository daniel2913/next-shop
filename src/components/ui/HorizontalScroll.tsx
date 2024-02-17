import React from "react"
import { ScrollArea, ScrollBar } from "./ScrollArea"
import {cn} from "@/lib/utils"

type Props = {
	children:React.ReactNode
	className?:string
	innerClassName?:string
}
export default function HorizontalScroll ({children,className, innerClassName}:Props){
	return(
		<ScrollArea
			className={cn(
				"px-2 w-full overflow-y-hidden h-fit",
				className
			)}
		>
			<div
				className={cn(
					"flex overflow-y-hidden h-fit w-fit gap-4 flex-shrink-0",
					innerClassName
				)}
			>
				{children}
			</div>
			<ScrollBar className="" orientation="horizontal"/>
		</ScrollArea>
	)
}
