"use client"
import { Category } from "@/lib/DAL/Models"
import { clientValidations } from "./common"
import Form  from "./index"
import React from "react"
import { changeCategoryAction, createCategoryAction } from "@/actions/category"
import FileUpload from "../ui/FileUpload"
import Input from "../ui/Input"
import useImageFiles from "@/hooks/useImageFiles"

const validation = {
	name: clientValidations.name,
	image: clientValidations.images,
	description: clientValidations.description,
}

type Props = {
	category?:Category
}

export default function CategoryForm({category}: Props) {

	const action = category?.id 
		? (form:FormData)=>changeCategoryAction(category.id,form) 
		: createCategoryAction

	const [name, setName] = React.useState(category?.name||"")
	const [image, setImage] = useImageFiles((category && [`/categories/${category.image}`])||[])

	return (
		<Form
			className=""
			validations={validation}
			action={action}
		>
			<Input
				crossOrigin={"false"}
				label="category Name"
				id="name"
				name={"name"}
				value={name}
				validate={validation.name}
				setValue={(str: string) => setName(str)}
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
