"use server"
import fs from "node:fs/promises"
import _path from "path"
import { ProductModel, BrandModel, CategoryModel } from "@/lib/Models"
import type { Dirent } from "node:fs"
import { DataModel } from "@/lib/Models/base"

async function clearGroup<T extends { id: number, images: string[] }>(group: DataModel<T>) {
	if (!group.filePath) throw "No filepath"
	const [files, items] = await Promise.all([
		getAllFiles(`./public/${group.filePath}`),
		group.find()
	])
	const images: string[] = items.flatMap(i => i.images)
	const imagesFiltered = images.map(i => i.split(".").shift())
	const forDeletion = files.filter(file => !imagesFiltered.includes(file.split("/").pop()!.split(".").shift())).filter(file => !file.includes("template"))
	const res = forDeletion.map(file => fs.rm(file))
	await Promise.all(res)
	return forDeletion.length
}

async function clearOptimized() {
	const files = await getAllFiles("./public/optimized")
	const res = files.map(file => fs.rm(file))
	await Promise.all(res)
	return files.length
}

async function getAllFiles(path: string) {
	const dir = await fs.opendir(path, { recursive: true })
	let file: Dirent | null
	const rest = []
	const res: string[] = []
	while ((file = await dir.read(), file)) {
		if (file.isFile())
			res.push((_path.resolve(file.path, file.name)))
		else
			rest.push(file)
	}
	dir.close()
	return res
}

export async function cleanUp() {
	const res = await Promise.all([ProductModel, BrandModel, CategoryModel].map(i => clearGroup(i)))
	clearOptimized()
	const num = res.reduce((s, n) => s + n, 0)
	return num
}
