import React from "react"
import ImagesPreview from "./ImagesPreview"
import { Input } from "@/components/ui/Input"
import { Label } from "./Label"
import { Button } from "./Button"

function fileListAdapter(inp: File | FileList | null): File[] {
	if (!inp) return [] as File[]
	if (inp instanceof File) return [inp]
	return Array.from(inp)
}

type Props = {
	accept?: string
	size?: number
	id?: string
	name?: string
	className?: string
	value: File[]
	multiple?: boolean
	onChange: (file: File[]) => void
}

export default function ImageUpload({ multiple = false, ...props }: Props) {
	const id = React.useId()
	return (
		<label className="h-fit w-fit cursor-pointer">
			<Input
				name={props.name}
				multiple={multiple}
				accept={props.accept}
				id={props.id || id}
				className="hidden"
				type="file"
				onChange={(e) => {
					if (multiple)
						props.onChange([
							...props.value,
							...fileListAdapter(e.currentTarget.files),
						])
					else
						props.onChange(fileListAdapter(e.currentTarget.files).slice(0, 1))
				}}
			/>
			<br />
			<Button
				className="pointer-events-none cursor-pointer font-bold"
				type="button"
			>
				{" "}
				UPLOAD{" "}
			</Button>
		</label>
	)
}
