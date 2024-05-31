import * as React from "react";

import { cn } from "@/helpers/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		if (!props.id && props.label) props.id = Math.random().toString();
		return (
			<input
				{...props}
				aria-invalid={props.error ? "true" : undefined}
				onKeyDown={(e) => {
					if (e.key === "Escape") e.currentTarget.blur();
				}}
				type={type}
				className={cn(
					`peer flex h-[2em] w-full rounded-md border border-input
					bg-background px-3 py-2 text-sm font-semibold shadow-accent
					ring-0 file:border-0
					file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground
					invalid:border-destructive 
					invalid:text-destructive focus-visible:shadow-md focus-visible:outline-none
					disabled:cursor-not-allowed disabled:opacity-50
					aria-[invalid]:border-destructive aria-[invalid]:text-destructive
					`,
					className || "",
				)}
				ref={ref}
			/>
		);
	},
);
Input.displayName = "Input";
export { Input };
export default Input;
