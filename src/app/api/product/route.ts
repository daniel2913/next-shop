import { NextRequest, NextResponse } from "next/server"
import { ProductModel } from "@/lib/DAL/Models"
import {
	addController,
	deleteController,
	patchController,
	Tconfig,
	collectFromForm,
} from "@/lib/DAL/controllers/universalControllers"
import { getProducts} from "@/helpers/getProducts"

const config: Tconfig = {
	DIR_PATH: "./public/products/",
	model: ProductModel,
	multImages: true,
}



export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	return NextResponse.json(await getProducts(searchParams))
}

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
	const props: any = collectFromForm(await req.formData(), config)
	return addController(props, config)
}

export async function DELETE(req: NextRequest): Promise<NextResponse<any>> {
	const { id } = await req.json()
	return deleteController(id, config)
}

export async function PATCH(req: NextRequest): Promise<NextResponse<any>> {
	const props: any = collectFromForm(await req.formData(), config)
	return patchController({ ...props }, config)
}
