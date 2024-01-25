"use client"
import Form from "./index"
import React from "react"
import { clientValidations } from "./common.ts"
import { Brand } from "@/lib/DAL/Models/Brand.ts"
import { changeBrandAction, createBrandAction } from "@/actions/brand.ts"
import Input from "../ui/Input/index.tsx"
import { Textarea } from "@/components/material-tailwind"
import FileUpload from "../ui/FileUpload/index.tsx"
import useImageFiles from "@/hooks/useImageFiles.ts"

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
				crossOrigin={"false"}
				label="Brand Name"
				id="name"
				name={"name"}
				value={name}
				validate={validation.name}
				setValue={(str: string) => setName(str)}
			/>
			<Textarea
				name={"description"}
				label="Description"
				value={description}
				onChange={(e) => setDescription(e.currentTarget.value)}
			/>
			<FileUpload
			id= "images"
			label= "Product image"
			value={image}
			onChange={(files:File[])=>setImage(files)}
			accept= "image/jpeg"
			preview
			/>
		
		</Form>
	)
}
