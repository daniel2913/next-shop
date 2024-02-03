import React from "react"
import ImagesPreview from "../ImagesPreview"
import {Input} from "@/components/UI/Input/index"
import { Label } from "../label"
import { Button } from "../button"


function fileListAdapter(inp: File | FileList | null): File[] {
	if (!inp) return [] as File[]
	if (inp instanceof File) return [inp]
	return Array.from(inp)
}

type Props = {
	accept?: string
	size?: number
	label: string
	id: string
	className?: string
	preview: boolean
	value: File[]
	multiple?: boolean
	onChange: (file: File[]) => void
}

export default function FileUpload({
	multiple = false,
	...props
}: Props) {
	return (
		<div className={`${props.className} flex flex-col`}>
			<Input
				name={props.label}
				multiple={multiple}
				accept={props.accept}
				id={props.id}
				className="hidden"
				type="file"
				onChange={(e) => {
					if (multiple)
						props.onChange([...props.value, ...fileListAdapter(e.currentTarget.files)])
					else
						props.onChange(fileListAdapter(e.currentTarget.files).slice(0, 1))
				}}
			/>
			<Label
				className="w-fit cursor-pointer"
				htmlFor={props.id}
			>
			<Button className="pointer-events-none" type="button">	UPLOAD </Button>
			</Label>
			{
				props.preview
					?
					<ImagesPreview
						className="w-full"
						images={props.value}
						delImage={(idx: number) => {
							props.onChange(props.value.filter((_, idxOld) => idx !== idxOld))
						}}
					/>
					: null
			}
		</div>
	)
}
