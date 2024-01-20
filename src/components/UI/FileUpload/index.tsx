"use client"

import { Button, Input } from "@/components/material-tailwind"
import React from "react"
import ImagesPreview from "../ImagesPreview"
import PreviewProductCard from "@/components/product/ProductCard/PreviewProductCard"


function fileListAdapter(inp: File | FileList | null): File[] {
	if (!inp) return [] as File[]
	if (inp instanceof File) return [inp]
	return Array.from(inp)
}

type Props = {
	value: File[]
	validate?: (files: File[]) => false | string
	onChange: (files: File[]) => void
	multiple: boolean
	accept?: string
	size?: number
	label: string
	id: string
	className?: string
	preview: boolean
}

export default function FileUpload(props: Props) {
	const [value, setValue] = React.useState(
		props.value.filter(a => a instanceof File) as File[]
	)
	const inpRef = React.useRef<HTMLInputElement>(null)
	const [error, setError] = React.useState(" ")
	React.useEffect(() => {
		if (!inpRef.current) {
			return
		}
		const data = new DataTransfer()
		for (const file of props.value) {
			console.log(file)
			data.items.add(file as File)
		}
		console.log(inpRef.current.files)
		inpRef.current.files = data.files
		console.log(inpRef.current.files)
	}, [value])


	return (
		<div className={`${props.className} flex flex-col`}>
			<Input
				containerProps={{
					className: "h-4"
				}}
				variant="standard"
				crossOrigin={false}
				inputRef={inpRef}
				label={props.label}
				multiple={props.multiple}
				accept={props.accept}
				id={props.id}
				name={props.id}
				className="hidden"
				type="file"
				onChange={(e) => props.onChange([...props.value, ...fileListAdapter(e.currentTarget.files)])}
			/>
			<Button
				onClick={() => {
					console.log(inpRef.current)
					inpRef.current?.click()
				}}
			>
				UPLOAD
			</Button>
			{
				props.validate
					? <span className="text-accent1-600">{error}</span>
					: null
			}
			{
				props.preview
					?
					<ImagesPreview
						className="w-full"
						images={props.value}
						delImage={(idx: number) => {
							setValue(value.filter((_, idxOld) => idx !== idxOld))
						}}
					/>
					: null
			}
		</div>
	)
}
