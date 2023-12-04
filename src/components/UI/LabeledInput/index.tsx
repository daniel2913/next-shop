"use client"
import { FormFieldValidator } from "@/components/forms"
import React from "react"
import ImagesPreview from "../ImagesPreview"
import Selector from "../Selector"

interface BaseProps {
	label?: string
	placeholder?: string
	className?: string
	id: string
	accept?: string
	validator?: FormFieldValidator
}
interface TextProps extends BaseProps {
	type: "text" | "password" | "hidden"
	multiple?: false
	options?: never[]
	value: string
	setValue: React.Dispatch<React.SetStateAction<string>>
}
interface FileProps extends BaseProps {
	type: "file"
	multiple?: boolean
	options?: never[]
	value: File[]
	setValue: React.Dispatch<React.SetStateAction<File[]>>
}
interface SelectProps extends BaseProps {
	type: "select"
	multiple?: false
	options: string[]
	value: string
	setValue: React.Dispatch<React.SetStateAction<string>>
}

type Props = TextProps | FileProps | SelectProps

function fileListAdapter(inp: File | FileList | null): File[] {
	if (!inp) return [] as File[]
	if (inp instanceof File) return [inp]
	return Array.from(inp)
}

export default function LabeledInput({
	label = "default label",
	multiple = false,
	accept = "image/jpg",
	placeholder = "input",
	type,
	className = "",
	options = [],
	id,
	value,
	setValue,
	validator: validation,
}: Props) {
	type = type ? type : "text"
	const [error, setError] = React.useState<string>("")
	const inpRef = React.useRef<HTMLInputElement>(null)

	function validate(
		value: string | File[],
		validation: Props["validator"]
	) {
		if (validation) {
			const err = validation(value)
			if (err.valid) {
				setError("")
				return true
			} else {
				setError(err.msg)
				return false
			}
		}
	}

	function fileChangeHandeler(fileList: FileList | null) {
		if (type !== "file" || !fileList) return false
		const files = fileListAdapter(fileList)
		const filesValidation = validate(files, validation)
		if (filesValidation) setValue((prev) => [...prev, ...files])
	}

	React.useEffect(() => {
		if (type !== "file" || !value || !inpRef.current) {
			return
		}
		const data = new DataTransfer()
		for (const file of value) {
			data.items.add(file as File)
		}
		inpRef.current.files = data.files
	}, [value])

	if (type === "select")
		return (
			<Selector
				value={value as string}
				setValue={setValue}
				options={options}
				id={id}
				label={label}
			/>
		)
	if (type === "file")
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
					multiple={multiple}
					accept={accept}
					id={id}
					name={id}
					className="hidden"
					type={type}
					placeholder={placeholder}
					value=""
					onChange={(e) =>
						fileChangeHandeler(e.currentTarget.files)
					}
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
					images={value}
					delImage={(idx: number) => {
						setValue(value.filter((_, idxOld) => idx !== idxOld))
					}}
				/>
			</div>
		)
	return (
		<div
			className={`${className} ${
				type === "hidden" ? "hidden" : ""
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
				onBlur={() => validate(value, validation)}
				id={id}
				name={id}
				className="bg-cyan-50"
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => {
					if (type !== "hidden") setValue(e.currentTarget.value)
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
