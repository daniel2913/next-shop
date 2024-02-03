import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?:boolean
	label:string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
			<div className="group w-fit flex-grow relative flex flex-col-reverse">
      <textarea
        {...props}
				name={props.name||props.id||undefined}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
      />
				{props.label
				? <Label 
						className="text-md leading-5 peer-invalid:text-destructive peer-aria-[invalid]:text-destructive"
						htmlFor={props.id}
					>
						{props.label}
					</Label>
				:null
				}
			</div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
