"use client"

import React from "react"
import { cn } from "@/helpers/utils"

const ScrollArea = React.forwardRef(function ScrollArea(
	{ children, className }: { children: React.ReactNode; className: string },
	ref: React.ForwardedRef<HTMLDivElement>
) {
	return (
		<div
			ref={ref}
			style={{
				scrollbarWidth: "thin",
				scrollbarGutter: "none",
			}}
			className={cn(className, "h-full w-full overflow-y-scroll")}
		>
			{children}
		</div>
	)
})

function ScrollBar() {
	return null
}

export { ScrollArea, ScrollBar }
