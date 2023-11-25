"use client"
import useModalStore from "@/store/modalStore"
import Form, {
	FormFieldValidator,
	FormFieldValue,
} from "../../../components/forms/index"
import React from "react"

const fields = { name: "", description: "", link: "", image: null } as const
const action = "api/brand"

const validation: { [i in keyof typeof fields]: FormFieldValidator } = {
	name: (value: FormFieldValue) => {
		if (typeof value !== "string")
			return { valid: false, msg: "Name can only be string!" }

		return value.length === 0
			? { valid: false, msg: "Name Required!" }
			: { valid: true }
	},
	image: (file: FormFieldValue) => {
		if (typeof file === "string")
			return { valid: false, msg: "Image can only be a file!" }
		if (!file || (Array.isArray(file) && file.length === 0))
			return { valid: true }
		const files = file instanceof FileList ? Object.values(file) : [file]
		for (const file of files) {
			const ext = file.name.split(".").pop()
			if (ext != "jpeg" && ext != "jpg")
				return { valid: false, msg: "Only jpegs!" }
			if (file.size > 1024 * 512) return { valid: false, msg: "Only under 0.5MB!" }
		}
		return { valid: true }
	},
	description: (value: FormFieldValue) => {
		if (typeof value != "string")
			return { valid: false, msg: "Description can only be string!" }
		return value.length === 0
			? { valid: false, msg: "Description required" }
			: { valid: true }
	},
	link: (value: FormFieldValue) => {
		return typeof value != "string"
			? { valid: false, msg: "Link can only be string!" }
			: { valid: true }
	},
}

const fieldValues = {
	name: {
		id: "name",
		label: "Brand name",
		placeholder: "Brand",
		validator: validation["name"],
	},
	description: {
		id: "description",
		label: "Brand description",
		placeholder: "Text",
		validator: validation["description"],
	},
	link: {
		id: "link",
		label: "Brand link",
		placeholder: "example.com",
		validator: validation["link"],
	},
	image: {
		id: "image",
		label: "Brand image",
		type: "file",
		multiple: false,
		accept: "image/jpeg",
		validator: validation["image"],
	},
} as const

type props =
	| {
			method: "PUT"
	  }
	| {
			method: "PATCH"
			targId?: string
			targName?: string
	  }

export default function useBrandForm(props: props) {
	const modalState = useModalStore((state) => state.base)
	if (props.method === "PATCH" && !props.targId && !props.targName)
		return function Error() {
			return <>Error!</>
		}
	function show() {
		modalState.setModal(
			props.method === "PUT" ? (
				<Form
					action={action}
					method={props.method}
					fieldValues={fieldValues}
					fields={fields}
				/>
			) : (
				<Form
					{...(props.targId
						? { targId: props.targId }
						: { targName: props.targName })}
					action={action}
					method={props.method}
					fieldValues={fieldValues}
					fields={fields}
				/>
			),
		)
		modalState.show()
	}
	return show
}
