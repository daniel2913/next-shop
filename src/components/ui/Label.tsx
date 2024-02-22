"use client"

import * as React from "react"

import { cn } from "@/helpers/utils"
import { LabelHTMLAttributes } from "react"

const Label = React.forwardRef(function Label(
	{ className, ...props }: LabelHTMLAttributes<any>,
	ref: React.ForwardedRef<HTMLLabelElement>
) {
	return (
		<label
			ref={ref}
			className={cn("space-y-2 font-semibold", className)}
			{...props}
		/>
	)
})

export { Label }
