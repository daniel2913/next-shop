"use client"
import React from "react"
import useToast from "@/hooks/modals/useToast"
import { Button } from "../UI/button"

export type FormFieldValue = string | File[] | string[]
export interface FormFieldValidator {
	(v: FormFieldValue): string | false
}
type Props = {
	className: string
	validations: Record<string, (val: any) => false | string>
	action: (payload: FormData) => Promise<false | string>
	children: React.ReactNode
	preview?: React.ReactElement
}

export default function Form({
	preview,
	validations,
	className,
	children,
	action,
}: Props) {
	const [loading, setLoading] = React.useState(false)
	const {error:showError,info:showStatus} = useToast()
	
	async function submitHandler(e: FormData) {
		const payload = new FormData()
		for (const [key, value] of e.entries()) {
			if (validations[key]) {
				const entryInvalid = validations[key](value)
				if (entryInvalid) {
					showError(entryInvalid,`${key} validation`)
					return
				}
			}
			payload.append(key,value)
		}
		setLoading(true)
		action(payload)
			.then(res=> showStatus(res||"Successful!","Server response"))
			.catch(res=> showError(res.message||"Some Error","Server response"))
			.finally(()=>setLoading(false))
	}

	return (
		<div className={`${className} flex gap-4 items-center justify-center`}>
			<form
				action={submitHandler}
				className="flex flex-col gap-3 "
			>
				{children}
					<Button
						disabled={loading}
						type="submit"
					>
						{loading ? "Loading..." : "Send"}
					</Button>
			</form>
			{preview || null}
		</div>
	)
}
