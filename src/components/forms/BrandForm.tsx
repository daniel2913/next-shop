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
			<Input
				label="Name"
				id="name"
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
			/>
			<Textarea
				label="Description"
				id="description"
				value={description}
				onChange={(e) => setDescription(e.currentTarget.value)}
			/>
			<FileUpload
			id= "image"
			label= "Product image"
			value={image}
			onChange={(files:File[])=>setImage(files)}
			accept= "image/jpeg"
			preview
			/>
		
		</Form>
	)
}
