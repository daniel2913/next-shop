"use client"
import React, { FormEvent } from "react"
import LabeledInput from "@/components/UI/LabeledInput"
import useToast from "@/hooks/modals/useToast"

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
	const {show:showToast} = useToast()
	
	async function submitHandler(e: FormData) {
		const payload = new FormData()
		for (const [key, value] of e.entries()) {
			if (validations[key]) {
				const entryInvalid = validations[key](value)
				if (entryInvalid) {
					showToast(`${key}: ${entryInvalid}`)
					return
				}
			}
			payload.append(key,value)
		}
		setLoading(true)
		const res = await action(payload) || "Successful!"
		setLoading(false)
		showToast(res)
	}

	return (
		<div className={`${className} flex gap-4 items-center justify-center`}>
			<form
				action={submitHandler}
				className="flex flex-col gap-3 "
			>
				{children}
					<button
						disabled={loading}
						type="submit"
					>
						{loading ? "Loading..." : "Send"}
					</button>
			</form>
			{preview || null}
		</div>
	)
}
