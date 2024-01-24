import { FileStorage } from "@/lib/DAL/FileStorage"
import { randomUUID } from "crypto"

export type Image = { file: File | null; name: string }

export async function handleImages(images:File[],path:string):Promise<string[]|null>
export async function handleImages(images:File,path:string):Promise<string|null>
export async function handleImages(images: File|File[], path: string): Promise<string|string[]|null> {
	const _images = Array.isArray(images) ? images : [images]
	const prepImages: Promise<Image>[] = []
	for (const i of _images) {
		const ext = i.type?.split("/").pop()
		if (ext !== "jpeg" && ext !== "jpg") continue
		const image = handleImage(i, path)
		if (image !== null) prepImages.push(image)
	}
	const res = await saveImages(await Promise.all(prepImages),path)
 	if (!res) return res
	if (Array.isArray(images))
		return res
	return res[0]
}

export async function handleImage(image: File, path: string): Promise<Image> {
	console.log(`Checking ${image.name}`);
	
	if (await FileStorage.exists(image.name, path)) {
		console.log("Has it")
		return { name: image.name, file: null }
	}
	const imageName = `${randomUUID().replace("-", "").slice(0, 8)}.jpg`
	console.log(`New name is ${imageName}`)
	return { name: imageName, file: image }
}

export async function saveImages(images: Image[], path: string) {
	const resultsPromises: Promise<boolean>[] = []
	for (const image of images) {
		if (image.file === null) resultsPromises.push(Promise.resolve(true))
		else resultsPromises.push(FileStorage.write(image.name, path, image.file))
	}
	const results = await Promise.all(resultsPromises)
	const names = images
		.filter((i,idx)=>results[idx])
		.map(i=>i.name)
	if (names.length>0) return names
	return null
}

export function deleteImages(names: string[], path: string): void {
	for (const name of names) {
		deleteImage(name, path)
	}
}

export function deleteImage(name: string, path: string): void {
	if (name === "template.jpg") return
	FileStorage.delete(name, path)
}
