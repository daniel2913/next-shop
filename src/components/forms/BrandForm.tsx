"use client"
import Form, { clientValidations } from "./common.tsx"
import React from "react"
import { Brand } from "@/lib/Models/Brand.ts"
import { changeBrandAction, createBrandAction } from "@/actions/brand.ts"
import ImageUpload from "../ui/ImageUpload.tsx"
import useImageFiles from "@/hooks/useImageFiles.ts"
import Input from "../ui/Input.tsx"
import { Label } from "../ui/Label.tsx"
import ImagesPreview from "../ui/ImagesPreview.tsx"

const validation = {
	name: clientValidations.name,
	image: clientValidations.images,
}

type Props = {
	brand?: Brand
}

export default function BrandForm({ brand }: Props) {
	const action = brand?.id
		? (form: FormData) => changeBrandAction(brand.id, form)
		: createBrandAction

	const [name, setName] = React.useState(brand?.name || "")
	const [image, setImage] = useImageFiles(
		(brand && [`/brands/${brand.image}`]) || []
	)

	return (
		<Form
			className=""
			validations={validation}
			action={action}
		>
			<Label>
				Brand Name
				<Input
					name="name"
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
				/>
			</Label>
			<Label>
				Logo
				<ImageUpload
					name="image"
					value={image}
					onChange={(files: File[]) => setImage(files)}
					accept="image/jpeg"
				/>
			</Label>
			<ImagesPreview
				className="w-full"
				images={image}
				delImage={(idx: number) => {
					setImage(image.filter((_, idxOld) => idx !== idxOld))
				}}
			/>
		</Form>
	)
}
