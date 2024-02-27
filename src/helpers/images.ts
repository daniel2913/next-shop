import { FileStorage } from "@/lib/FileStorage"
import { randomUUID } from "crypto"
import _path from "path"

export type Image = { file: File | null; name: string }

export async function handleImages(
	images: File[],
	path: string
): Promise<string[] | null>
export async function handleImages(
	images: File,
	path: string
): Promise<string | null>
export async function handleImages(
	images: File | File[],
	path: string
): Promise<string | string[] | null> {
	const _images = Array.isArray(images) ? images : [images]
	const prepImages: Promise<Image>[] = []
	for (const i of _images) {
		const ext = i.type?.split("/").pop()
		if (ext !== "jpeg" && ext !== "jpg") continue
		const image = handleImage(i, path)
		if (image !== null) prepImages.push(image)
	}
	const Images = await Promise.all(prepImages)
	if (Images.length === 0)
		Images[0] = { name: "template.jpg", file: null}
	const res = await saveImages(Images, path)
	if (!res) return res
	if (Array.isArray(images)) return res
	return res[0]
}

export async function handleImage(image: File, path: string): Promise<Image> {
	const fullPath = _path.join(path, image.name)
	if (await FileStorage.exists(fullPath)) {
		return { name: image.name, file: null }
	}
	const imageName = `${randomUUID().replace("-", "").slice(0, 8)}.jpg`
	return { name: imageName, file: image }
}

export async function saveImages(images: Image[], path: string) {
	const resultsPromises: Promise<boolean>[] = []
	for (const image of images) {
		const fullPath = _path.join(path, image.name)
		if (image.file === null) resultsPromises.push(Promise.resolve(true))
		else resultsPromises.push(FileStorage.write(fullPath, image.file))
	}
	const results = await Promise.all(resultsPromises)
	const names = images.filter((i, idx) => results[idx]).map((i) => i.name)
	if (names.length > 0) return names
	return null
}

export function deleteImages(names: string[], path: string): void {
	for (const name of names) {
		deleteImage(name, path)
	}
}

export function deleteImage(name: string, path: string): void {
	if (name === "template.jpg") return
	const fullPath = _path.join(path, name)
	FileStorage.delete(fullPath)
}
