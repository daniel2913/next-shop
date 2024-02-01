import {FormFieldValue } from "./index"
export const clientValidations = {
	name: (value: FormFieldValue) => {
		if (typeof value !== "string")
			return "Name can only be string!"

		return value.length === 0
			? "Name Required!"
			: false
	},
	images: (valueIn: File[]|File|null) => {
		if (!valueIn) return false
		const value = [valueIn].flat()
		if (value.length===0) return false
		for (const file of value) {
			if (file.size===0) continue
			const ext = file.type
			if (ext !== "image/jpeg" && ext !== "image/jpg")
				return "Only jpegs!" + file.size
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
