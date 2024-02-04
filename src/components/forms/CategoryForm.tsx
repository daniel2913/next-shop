"use client"
import { Category } from "@/lib/DAL/Models"
import { clientValidations } from "./common"
import Form  from "./index"
import React from "react"
import { changeCategoryAction, createCategoryAction } from "@/actions/category"
import FileUpload from "../UI/FileUpload"
import Input from "../UI/Input"
import useImageFiles from "@/hooks/useImageFiles"
import { Label } from "../UI/label"

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
			<Label>
			Category Name
			<Input
				id="name"
				name={"name"}
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
			/>
			</Label>
			<Label>
			Image
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
