import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "../label"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
	error?:boolean
	label?:string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
		if (!props.id && props.label) props.id = Math.random().toString()
    return (
      <input
        {...props}
				aria-invalid={props.error ? "true" : undefined}
        type={type}
        className={cn(
          `flex peer h-[2em] w-full rounded-md border border-input
					bg-background px-3 py-2 text-sm ring-0 focus-visible:outline-none
					focus-visible:shadow-md shadow-accent
					file:border-0 file:bg-transparent file:text-sm file:font-medium
					placeholder:text-muted-foreground 
					disabled:cursor-not-allowed disabled:opacity-50 font-semibold
					invalid:border-destructive invalid:text-destructive
					aria-[invalid]:border-destructive aria-[invalid]:text-destructive
					`,
          className,
        )}
        ref={ref}
      />
    )
  }
)
Input.displayName = "Input"
export {Input}
export default Input
