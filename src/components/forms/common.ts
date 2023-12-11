import {FormFieldValue } from "./index"
export const clientValidations = {
	name: (value: FormFieldValue) => {
		if (typeof value !== "string")
			return "Name can only be string!"

		return value.length === 0
			? "Name Required!"
			: false
	},
	images: (value: FormFieldValue) => {
		if (typeof value === "string")
			return "Image can only be a file!"
		if (!value) return false
		const files = value instanceof File ? [value] : value
		if (files.length === 0) return "Something strange"
		for (const file of files) {
			const ext = file.name.split(".").pop()
			if (ext !== "jpeg" && ext !== "jpg")
				return "Only jpegs!"
			if (file.size > 1024 * 512)
				return "Only under 0.5MB!"
		}
		return false
	},
	description: (value: FormFieldValue) => {
		if (typeof value !== "string")
			return "Description can only be string!"
		return value.length === 0
			? "Description required"
			: false
	},
}
