"use client"
import { FormFieldValidator } from "@/components/forms"
import React from "react"
import ImagesPreview from "../ImagesPreview"
import Selector from "../Selector"
import CheckBoxBlock from "../CheckBoxBlock"
import { Button, Input } from "@material-tailwind/react"

export type InputGeneralProps = {
	label: string
	id: string
	placeholder?: string
	className?: string
	optionClassName?: string
	validator?: FormFieldValidator
} 
export type InputOptionStaticProps = (
		{	
			type: "text" | "password" | "hidden"
	  }
	| {
			type: "file"
			accept?: string
			multiple?: boolean
	  }
	| ({type: "select"} & Omit<React.ComponentProps<typeof Selector>,"value"|"setValue">)
	| ({type: "checkboxes"} &Omit<React.ComponentProps<typeof CheckBoxBlock>,"value"|"setValue">)
)
export type InputOptionDynamicProps = (
		{	
			type: "text" | "password" | "hidden"
			value: string
			setValue: (val:string)=>void

	  }
	| {
			type: "file"
			value: File[]
			setValue: (files:File[])=>void
	  }
	| ({type: "select"} & Pick<React.ComponentProps<typeof Selector>,"value"|"setValue">)
	| ({type: "checkboxes"} & Pick<React.ComponentProps<typeof CheckBoxBlock>,"value"|"setValue">)
)

function fileListAdapter(inp: File | FileList | null): File[] {
	if (!inp) return [] as File[]
	if (inp instanceof File) return [inp]
	return Array.from(inp)
}

export default function LabeledInput({
	id,
	label,
	placeholder ,
	className,
	validator,
	...props
}: InputGeneralProps&InputOptionStaticProps&InputOptionDynamicProps) {
	const [error, setError] = React.useState<string>(" ")
	const inpRef = React.useRef<HTMLInputElement>(null)

	function validate(value: string | File[], validation: InputGeneralProps["validator"]) {
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
			id={id}
			value={props.value}
			setValue={props.setValue}
			view={props.view}
			className={props.optionClassName}
		/>
	)


	if (props.type === "select")
		return (
			<Selector
				className={props.optionClassName}
				options={props.options}
				value={props.value}
				label={label}
				setValue={props.setValue}
				id={id}
			/>
		)
	if (props.type === "file")
		return (
			<div className={`${className} flex flex-col`}>
				<Input
					containerProps={{
						className:"y-0"
					}}
					variant="standard"
					crossOrigin={false}
					inputRef={inpRef}
					label={label}
					multiple={props.multiple}
					accept={props.accept}
					id={id}
					name={id}
					className="hidden"
					type="file"
					placeholder={placeholder}
					value=""
					onChange={(e) => fileChangeHandeler(e.currentTarget.files)}
				/>
				<Button 
					onClick={()=>{
						console.log(inpRef.current)
						inpRef.current?.click()
					}}
				>
				UPLOAD
				</Button>
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
			<Input
				crossOrigin={false}
				ref={inpRef}
				label={label}
				onBlur={() => validate(props.value, validator)}
				error={!!error&&error!==" "}
				success={error===""}
				id={id}
				name={id}
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
