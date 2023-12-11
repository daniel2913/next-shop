import { NextRequest, NextResponse } from "next/server"

import { BrandModel } from "@/lib/DAL/Models"
import {
	addController,
	deleteController,
	getController,
	patchController,
	form,
	collectFromForm,
} from "@/lib/DAL/controllers/universalControllers"

const config = {
	DIR_PATH: "./public/brands/",
	model: BrandModel,
	multImages: false,
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get("id") || undefined
	const name = searchParams.get("name") || undefined

	return await getController({ name, id }, config)
}

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
	const form = await req.formData()
	const props: Partial<form> = {}
	for (const [key, value] of form.entries()) {
		if (key === "image") {
			props["image"] = value
		} else {
			props[key] = value.toString() || undefined
		}
	}
	return await addController(props, config)
}

export async function DELETE(req: NextRequest): Promise<NextResponse<any>> {
	const { id } = await req.json()
	return await deleteController<typeof BrandModel>(id, config)
}

export async function PATCH(req: NextRequest): Promise<NextResponse<any>> {
	const props: any = collectFromForm(await req.formData(), config)
	return await patchController(props, config)
}
