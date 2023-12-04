import { NextResponse } from "next/server"
import {
	Image,
	deleteImages,
	handleImages,
	saveImages,
} from "../../../../helpers/images"
import { Tconfig, form, imagesDiff, isValidDocument } from "."

export default async function patchController<T>(
	{ targId, targName, ...props }: any,
	config: Tconfig<T>
) {
	const { DIR_PATH, model, multImages } = config

	if (!targId)
		return new NextResponse("Invalid target", { status: 400 })
	const cur = await model.findOne({ id: targId })
	if (!cur) {
		//!isDocument(cur)
		return new NextResponse("Not Found", { status: 404 })
	}

	let newImages: Image[] = []
	const imagesPath = config.multImages ? "images" : "image"
	const oldImages = config.multImages
		? (cur[imagesPath] as string[])
		: ([cur[imagesPath]] as string[])

	props["delImages"] = props["delImages"]
		? props["delImages"].split(";")
		: []
	let delImages = props["delImages"].filter((strNum: string) => {
		return !Number.isNaN(+strNum) && +strNum < oldImages.length
	})
	if (props[imagesPath] && props[imagesPath].length > 0) {
		newImages = handleImages(props[imagesPath])
	}
	props[imagesPath] = imagesDiff(
		newImages.map((image) => image.name),
		config,
		oldImages,
		delImages
	)
	if (!multImages) {
		if (props[imagesPath].length > 1 || !props[imagesPath]) {
			return new NextResponse("Too much single image!", {
				status: 500,
			})
		}
		props[imagesPath] = props[imagesPath][0]
			? props[imagesPath][0]
			: "template.jpg"
	} else {
		props[imagesPath] = props[imagesPath][0]
			? props[imagesPath]
			: ["template.jpg"]
	}
	delImages = delImages.map((idx: string) => oldImages[+idx])

	if (!multImages && newImages.length > 0) {
		delImages = oldImages
	}

	const patch: any = {}
	for (const i in cur) {
		if (i in props && i in cur && i !== "id" && props[i]) {
			patch[i] = props[i]
		}
	}
	const res = await model.patch(targId, patch)
	if (!res)
		return new NextResponse("Something on BD", { status: 500 })
	try {
		if (!(await saveImages(newImages, DIR_PATH))) {
			deleteImages(
				newImages.map((image) => image.name),
				DIR_PATH
			)
			return new NextResponse("Couldnt save", { status: 500 })
		}
	} catch (error) {
		return new NextResponse("Errored on save", { status: 500 })
	}
	deleteImages(delImages, DIR_PATH)
	return NextResponse.json(res)
}
