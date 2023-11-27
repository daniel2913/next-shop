import { NextResponse } from "next/server"
import { deleteImages } from "../../../../helpers/images"
import { Tconfig } from "."
import { DataModels } from "../../Models/base"
import { FileStorage } from "../../FileStorage"

export default async function deleteController<T extends DataModels>(
	id: string | undefined,
	config: Tconfig<T>,
) {
	const { model, DIR_PATH } = config
	if (!id) {
		return new NextResponse("Invalid request", { status: 400 })
	}
	const { image, images } = await model.findOne({ id: id })
	if (image) deleteImages([image], DIR_PATH)
	if (images) deleteImages(images, DIR_PATH)
	const stat = await model.delete(id)
	return NextResponse.json(stat)
}
