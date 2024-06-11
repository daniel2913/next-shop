import { FileStorage } from "@/lib/FileStorage";
import { randomUUID } from "crypto";
import _path from "path";
import { toArray } from "./misc";
import { resolveImageConflict } from "./resolveImagesConflict";
import { ServerError } from "@/actions/common";

export type ImageNameAndFile = { file: File | null; name: string };

export async function handleImages(
	_images: File | File[],
	path: string,
): Promise<ImageNameAndFile[]> {

	const images = toArray(_images)
	const prepImages: Promise<ImageNameAndFile>[] = [];
	for (const i of images) {
		const ext = i.type?.split("/").pop();
		if (ext !== "jpeg" && ext !== "jpg") continue;
		const image = handleImage(i, path);
		if (image !== null) prepImages.push(image);
	}
	const fileAndName = await Promise.all(prepImages);
	if (fileAndName.length === 0) fileAndName[0] = { name: "template.jpg", file: null };
	return fileAndName
}

export async function handleImage(image: File, path: string): Promise<ImageNameAndFile> {
	const fullPath = _path.join(path, image.name);
	if (await FileStorage.exists(fullPath)) {
		return { name: image.name, file: null };
	}
	const imageName = `${randomUUID().replace("-", "").slice(0, 8)}.jpg`;
	return { name: imageName, file: image };
}

export async function saveImages(images: ImageNameAndFile[], path: string) {
	const resultsPromises: Promise<boolean>[] = [];
	for (const image of images) {
		const fullPath = _path.join(path, image.name);
		if (image.file === null) resultsPromises.push(Promise.resolve(true));
		else resultsPromises.push(FileStorage.write(fullPath, image.file));
	}
	const results = await Promise.all(resultsPromises);
	const names = images.filter((i, idx) => results[idx]).map((i) => i.name);
	if (names.length > 0) return names;
	return null;
}

export function deleteImages(names: string[], path: string): void {
	for (const name of names) {
		deleteImage(name, path);
	}
}

export function deleteImage(name: string, path: string): void {
	if (name === "template.jpg") return;
	const fullPath = _path.join(path, name);
	FileStorage.delete(fullPath);
}


export async function imagesHandler(path: string, _files: File[] | File | string | string[], prev?: string[]) {
	const files = toArray(_files)
	const { toKeep, toDelete, newFiles } = resolveImageConflict(files, prev)

	const namedImages = await handleImages(newFiles, path)
	const saved = await saveImages(namedImages, path)

	const names = namedImages.map(r => r.name)

	if (!saved || saved.length !== namedImages.length) {
		deleteImages(names, path)
		throw ServerError.unknown("Error while trying to save new images")
	}

	let newNames = [...names, ...toKeep]

	if (newNames.length > 1) {
		newNames = newNames.filter(n => n !== "template.jpg")
	}
	return {
		names: newNames,
		writeChanges: () => deleteImages(toDelete, path),
		rollback: () => deleteImages(names, path)
	}
}
