import fs from "node:fs/promises"
import _path from "path"
import { ProductModel, BrandModel, CategoryModel } from "@/lib/Models"
import { Dirent } from "node:fs"
import { DataModel } from "@/lib/Models/base"

async function clearGroup<T extends { id: number, images: string[] }>(group: DataModel<T>) {
	if (!group.filePath) throw "No filepath"
	const [allImages, items] = await Promise.all([
		getAllFiles(`./public/${group.filePath}`),
		group.find()
	])
	const images = items.flatMap(i => i.images)
	const forDeletion = allImages.filter(image => images.includes(image.slice(-12))).filter(image => !image.includes("template"))
	forDeletion.forEach(file => fs.rm(file))
}

async function clearOptimized() {
	const files = await getAllFiles("./public/optimized")
	files.forEach(file => fs.rm(file))
}

async function getAllFiles(path: string) {
	const dir = await fs.opendir(path, { recursive: true })
	let file: Dirent | null
	const res: string[] = []
	while ((file = await dir.read()), file) {
		if (file.isFile())
			res.push((_path.resolve(file.path, file.name)))
	}
	dir.close()
	return res
}

export function cleanUp() {
	[ProductModel, BrandModel, CategoryModel].forEach(i => clearGroup(i))
	clearOptimized()
}
