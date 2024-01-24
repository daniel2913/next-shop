"use client"
import Form from "./index"
import React from "react"
import LabeledInput, { InputOptionStaticProps, InputGeneralProps } from "../ui/LabeledInput/index.tsx"
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
	const origImages = brand.image ? [`/brands/${brand.image}`] : []
	const [name, setName] = React.useState(brand?.name||"")
	const [description, setDescription] = React.useState(brand?.description||"")
	const [image, setImage] = useImageFiles(origImages)

	return (
		<Form
			className=""
			action={action}
			method={"PUT"}
		>
			<Input
				crossOrigin={false}
				label="Product Name label"
				id="name"
				name={"name"}
				value={name}
				validate={validation.name}
				setValue={(str: string) => setName(str)}
			/>
			<Textarea
				crossOrigin={false}
				name={"description"}
				label="Description"
				value={description}
				setValue={(str: string) => setDescription(str)}
			/>
			<FileUpload
			id= "images"
			label= "Product image"
			value={image}
			onChange={(files:File)=>setImage(file)}
			accept= "image/jpeg"
			preview
			/>
		
		</Form>
	)
}
