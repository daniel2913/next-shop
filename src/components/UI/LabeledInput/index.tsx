"use client"
import { FormFieldValidator } from "@/components/forms"
import React from "react"
import ImagesPreview from "../ImagesPreview"
import Selector from "../Selector"
import CheckBoxBlock from "../CheckBoxBlock"

type Props = {
	label?: string
	placeholder?: string
	className?: string
	id: string
	validator?: FormFieldValidator
}  & Optionals


type Optionals = (
		{	
			accept?:never,
			multiple?:never,
			selectProps?:never
			checkboxProps?:never
			props?:never
			type: "text" | "password" | "hidden"
			value: string
			setValue: (val:string)=>void
	  }
	| {
			type: "file"
			props?:never
			checkboxProps?:never
			selectProps?:never
			accept?: string
			multiple: boolean
			value: File[]
			setValue: (files:File[])=>void
	  }
	| {
			accept?:never,
			multiple?:never,
			checkboxProps?:never
			type: "select"
			selectProps: React.ComponentProps<typeof Selector>
	  }
	| {
			accept?:never,
			multiple?:never,
			type: "checkboxes"
			selectProps?:never
			checkboxProps: React.ComponentProps<typeof CheckBoxBlock>
		}
)

function fileListAdapter(inp: File | FileList | null): File[] {
	if (!inp) return [] as File[]
	if (inp instanceof File) return [inp]
	return Array.from(inp)
}

export default function LabeledInput({
	label,
	placeholder ,
	className,
	id,
	validator,
	...props
}: Props) {
	const [error, setError] = React.useState<string>("")
	const inpRef = React.useRef<HTMLInputElement>(null)

	function validate(value: string | File[], validation: Props["validator"]) {
		if (validation) {
			const err = validation(value)
			if (err) {
				setError(err)
				return false
			} else {
				setError("")
				return true
			}
		}
	}

	function fileChangeHandeler(fileList: FileList | null) {
		if (props.type !== "file" || !fileList) return false
		const files = fileListAdapter(fileList)
		const filesValidation = validate(files, validator)
		if (!filesValidation) return false 
		if (props.multiple) props.setValue([...props.value, ...files])
		else props.setValue([files[0]])
		return true
	}

	React.useEffect(() => {
		if (props.type !== "file" || !props.value || !inpRef.current) {
			return
		}
		const data = new DataTransfer()
		for (const file of props.value) {
			data.items.add(file as File)
		}
		inpRef.current.files = data.files
	}, [(props as any).value, props.type])

	if (props.type === "checkboxes")
		return(
		<CheckBoxBlock
			className="flex overflow-x-scroll w-full"
			{...props.checkboxProps}
		/>
	)

	if (props.type === "select")
		return (
			<Selector
				{...props.selectProps}
				id={id}
			/>
		)
	if (props.type === "file")
		return (
			<div className={`${className} flex flex-col`}>
				<label
					htmlFor={id || ""}
					className="text-gray-600"
				>
					{label}
				</label>
				<input
					ref={inpRef}
					multiple={props.multiple}
					accept={props.accept}
					id={id}
					name={id}
					className="hidden"
					type={props.type}
					placeholder={placeholder}
					value=""
					onChange={(e) => fileChangeHandeler(e.currentTarget.files)}
				/>
				<label
					className="cursor-pointer border-2 border-cyan-400 bg-cyan-200 p-1 font-semibold"
					htmlFor={id}
				>
					Upload
				</label>
				<span className="text-accent1-600">{error}</span>
				<ImagesPreview
					className="w-full"
					images={props.value}
					delImage={(idx: number) => {
						props.setValue(props.value.filter((_, idxOld) => idx !== idxOld))
					}}
				/>
			</div>
		)
	return (
		<div
			className={`${className} ${
				props.type === "hidden" ? "hidden" : ""
			} flex flex-col`}
		>
			<label
				htmlFor={id || ""}
				className="text-gray-600"
			>
				{label}
			</label>
			<input
				ref={inpRef}
				onBlur={() => validate(props.value, validator)}
				id={id}
				name={id}
				className="bg-cyan-50"
				type={props.type}
				placeholder={placeholder}
				value={props.value}
				onChange={(e) => {
					if (props.type !== "hidden") props.setValue(e.currentTarget.value)
				}}
			/>
			<label
				htmlFor={id || ""}
				className="text-accent1-600"
			>
				{error}
			</label>
		</div>
	)
}
