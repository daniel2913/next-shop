"use client"
import Form from "./index"
import React from "react"
import { clientValidations } from "./common.ts"
import { Brand } from "@/lib/DAL/Models/Brand.ts"
import { changeBrandAction, createBrandAction } from "@/actions/brand.ts"
import FileUpload from "../UI/FileUpload/index.tsx"
import useImageFiles from "@/hooks/useImageFiles.ts"
import Input from "../UI/Input"
import { Textarea } from "../UI/textarea.tsx"
import { Label } from "../UI/label.tsx"

const validation = {
	name: clientValidations.name,
	image: clientValidations.images,
	description: clientValidations.description,
}

type Props = {
	brand?:Brand
}

export default function BrandForm({brand}: Props) {

	const action = brand?.id 
		? (form:FormData)=>changeBrandAction(brand.id,form) 
		: createBrandAction

	const [name, setName] = React.useState(brand?.name||"")
	const [description, setDescription] = React.useState(brand?.description||"")
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
				id="name"
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
			/>
			</Label>
			<Label>
			Description
			<Textarea
				name="description"
				id="description"
				value={description}
				onChange={(e) => setDescription(e.currentTarget.value)}
			/>
			</Label>
			<Label>
			Logo
			<FileUpload
			id= "image"
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
