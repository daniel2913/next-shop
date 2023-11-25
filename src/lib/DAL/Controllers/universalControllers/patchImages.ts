import dbConnect from "@/lib/dbConnect"
import { Brand, BrandModel } from "../../Models"
import { NextResponse } from "next/server"
import {
	Image,
	deleteImages,
	handleImages,
	saveImages,
} from "../../../../helpers/images"
import { Tconfig, form, isValidDocument } from "."
import { FilterQuery } from "mongoose"

const DIR_PATH = "./public/brands/"
function error(msg: string, status: number) {
	return new NextResponse(msg, { status })
}
export default async function patchImages<T>(
	{ targId, targName, ...props }: any,
	config: Tconfig<T>,
) {
	const { DIR_PATH, model, multImages } = config
	const imagePath = multImages ? "images" : "image"
	const {
		newImageFiles,
		oldImageNames,
	}: { newImageFiles: (File | string)[]; oldImageNames: string[] } = props

	if (
		(!newImageFiles && !oldImageNames) ||
		(newImageFiles?.length === 0 && oldImageNames?.length === 0) ||
		(!targId && !targName) ||
		((newImageFiles?.length > 1 || oldImageNames?.length > 1) && !multImages)
	) {
		console.log("fleck")
		return error("Invalid request", 400)
	}

	await dbConnect()

	const query: FilterQuery<T> = targId ? { _id: targId } : { name: targName }

	const res = (await model.findOne(query)) as any
	if (!res || false) {
		// !isDocument(res)
		console.log("FIck")
		return error("Not Found", 404)
	}

	if (!(imagePath in res)) {
		console.log("HEck")
		return error("Object can't have any images", 400)
	}
	let imagesToDelete = oldImageNames || []
	if (!multImages) imagesToDelete = [res.image]

	if (
		multImages &&
		imagesToDelete.length > 0 &&
		imagesToDelete?.filter((name) => !res.images.includes(name)).length != 0
	) {
		console.log("No such images", imagesToDelete, res.images)
		return error("No such images in object", 400)
	}
	console.log("====>", newImageFiles)
	const newImages = newImageFiles ? handleImages(newImageFiles) : []
	if (!multImages && newImages.length > 1) return error("server Error21", 500)

	if (!(await saveImages(newImages, DIR_PATH))) {
		return new NextResponse("Couldn't save to storage", { status: 500 })
	}
	console.log(imagesToDelete)
	if (multImages) {
		res.images = res.images
			.filter((image: string) => !imagesToDelete.includes(image))
			.concat(newImages.map((image) => image.name))
	} else {
		res.image = newImages[0].name
	}
	console.log(res.images)
	const validDocument = await isValidDocument<T>(res)
	if (!validDocument) {
		console
		return new NextResponse("Invalid request", { status: 400 })
	}
	try {
		const stat = await validDocument //.save()
		deleteImages(imagesToDelete, DIR_PATH)
		console.log("Success")
		return NextResponse.json(stat)
	} catch {
		deleteImages(
			newImages.map((image) => image.name),
			DIR_PATH,
		)
	}
}
