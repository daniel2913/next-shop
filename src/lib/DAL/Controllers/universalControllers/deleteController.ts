import dbConnect from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import { deleteImages } from "../../../../helpers/images"
import { Tconfig } from "."
import { FilterQuery } from "mongoose"
import { DataModels } from "../../Models/base"
import { FileStorage } from "../../FileStorage"

export default async function deleteController<T extends DataModels>(
	_id: string | undefined,
	config: Tconfig<T>,
) {
	const { model, DIR_PATH } = config
	if (!_id) {
		return new NextResponse("Invalid request", { status: 400 })
	}
	const { image, images } = await model.findOne({ _id: _id })
	if (image) deleteImages([image], DIR_PATH)
	if (images) deleteImages(images, DIR_PATH)
	const stat = await model.delete(_id)
	return NextResponse.json(stat)
}
