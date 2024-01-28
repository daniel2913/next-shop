"use client"
import React, { FormEvent } from "react"
import LabeledInput from "@/components/UI/LabeledInput"

export type FormFieldValue = string | File[] | string[]
export interface FormFieldValidator {
	(v: FormFieldValue): string | false
}
export type FormFieldProps = Omit<
	React.ComponentProps<typeof LabeledInput>,
	"value" | "setValue"
>
type Props = {
	className: string
	validations: Record<string, (val: any) => false | string>
	action: (payload: any) => Promise<false | string>
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
	const [error, setError] = React.useState("")
	const [status, setStatus] = React.useState("")

	async function submitHandler(e: FormEvent<HTMLFormElement>) {
		const payload = new FormData()
		setError("")
		setStatus("")
		for (const [key, value] of e.entries()) {
			if (validations[key]) {
				const entryInvalid = validations[key](value)
				if (entryInvalid) {
					setError(`${key}: ${entryInvalid}`)
					return false
				}
			}
			payload.append(key,value)
		}
		setLoading(true)
		console.log(payload)
		const res = await action(payload)
		setLoading(false)
		if (!res) setStatus("Successful!")
		else setError(res)
		return true
	}

	return (
		<div className={`${className} flex`}>
			<form
				action={submitHandler}
				className="flex flex-col gap-3 "
			>
				{children}
				{loading ? (
					<button
						disabled={true}
						type="submit"
					>
						Loading...
					</button>
				) : (
					<button type="submit">Save</button>
				)}
				<span>{error}</span>
				<span>{status}</span>
			</form>
			{preview || null}
		</div>
	)
}
