"use client"

import React from "react"

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
			className={`h-full w-full overflow-y-scroll ${className}`}
		>
			{children}
		</div>
	)
})

export { ScrollArea }
