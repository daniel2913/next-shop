import { deleteImages, handleImages, saveImages } from "@/helpers/images.ts"
import { NextResponse } from "next/server"
import { Tconfig } from "./index.ts"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters.ts"

export default async function addController<T>(props: any, config: Tconfig<T>) {
	const { DIR_PATH, model, multImages } = config

	const imageFiles = ((multImages ? props["images"] : [props["image"]]) ||
		[]) as (File | string)[]

	const images = handleImages(imageFiles)
	if (multImages) {
		props.images = images.map((image) => image.name)
	} else {
		props.image = images[0].name
	}
	console.log(props)

	if (!(await saveImages(images, DIR_PATH))) {
		return new NextResponse("Server error", { status: 500 })
	}
	if (props.brand) {
		const brand = (await BrandCache.get()).find(
			(brand) => brand.name.toString() === props.brand
		)
		props.brand = brand?.id || undefined
	}
	if (props.category) {
		const category = (await CategoryCache.get()).find(
			(cat) => cat.name.toString() === props.category
		)
		props.category = category?.id || undefined
	}
	try {
		const res = await model.newObject(props)
		if (!res) {
			deleteImages(
				images.map((image) => image.name),
				DIR_PATH
			)
			throw "Could not save images"
		}
		return NextResponse.json(res, { status: 201 })
	} catch (error) {
		console.error(error)
		return new NextResponse("DB error", { status: 500 })
	}
}
