import { ServerError } from "@/actions/common"

export function resolveImageConflict(newImages: (File | string)[], oldImagesNames?: string[]): { toDelete: string[], toKeep: string[], newFiles: File[] } {
	if (!oldImagesNames) {
		if (newImages.some(i => typeof i === "string")) {
			throw ServerError.invalid("Non existent image referenced")
		}
		return { toKeep: [], toDelete: [], newFiles: newImages as File[] }
	}
	const newImageNames = newImages.map(i => typeof i === "string" ? i : i.name)
	return ({
		toKeep: oldImagesNames.filter(n => newImageNames.includes(n)),
		toDelete: oldImagesNames.filter(n => !newImageNames.includes(n)),
		newFiles: newImages.filter(f => typeof f !== "string" && !oldImagesNames.includes(f.name)) as File[]
	})
}
