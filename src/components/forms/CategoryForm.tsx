"use client";
import type { Category } from "@/lib/Models";
import { clientValidations } from "./common";
import Form from "./common";
import React from "react";
import { changeCategoryAction, createCategoryAction } from "@/actions/category";
import ImageUpload from "../ui/ImageUpload";
import Input from "../ui/Input";
import useImageFiles from "@/hooks/useImageFiles";
import { Label } from "../ui/Label";
import ImagesPreview from "../ui/ImagesPreview";

const validation = {
	name: clientValidations.name,
	image: clientValidations.images,
	description: clientValidations.description,
};

type Props = {
	category?: Category;
};

export default function CategoryForm({ category }: Props) {
	const action = category?.id
		? (form: FormData) => changeCategoryAction(category.id, form)
		: createCategoryAction;

	const [name, setName] = React.useState(category?.name || "");
	const [image, setImage] = useImageFiles(
		(category && category.images.map(v => `/categories/${v}`)) || [],
	);

	return (
		<Form className="" validations={validation} action={action}>
			<Label>
				Category Name
				<Input
					name={"name"}
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
				/>
			</Label>
			<Label>
				Image
				<ImageUpload
					name="images"
					value={image}
					onChange={(files: File[]) => setImage(files)}
					accept="image/jpeg"
				/>
			</Label>
			<ImagesPreview
				className="w-full"
				images={image}
				delImage={(idx: number) => {
					setImage([]);
				}}
			/>
		</Form>
	);
}
