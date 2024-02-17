"use client"
import Form, { clientValidations } from './common.tsx'
import React from "react"
import { Brand } from "@/lib/Models/Brand.ts"
import { changeBrandAction, createBrandAction } from "@/actions/brand.ts"
import FileUpload from "../ui/ImageUpload.tsx"
import useImageFiles from "@/hooks/useImageFiles.ts"
import Input from "../ui/Input.tsx"
import { Label } from "../ui/Label.tsx"

const validation = {
	name: clientValidations.name,
	image: clientValidations.images,
}

type Props = {
	brand?:Brand
}

export default function BrandForm({brand}: Props) {

	const action = brand?.id 
		? (form:FormData)=>changeBrandAction(brand.id,form) 
		: createBrandAction

	const [name, setName] = React.useState(brand?.name||"")
	const [image, setImage] = useImageFiles((brand && [`/brands/${brand.image}`])||[])

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
			<FileUpload
			name="image"
			value={image}
			onChange={(files:File[])=>setImage(files)}
			accept= "image/jpeg"
			preview
			/>
			</Label>
		
		</Form>
	)
}
