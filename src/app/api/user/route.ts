import { createNewUser } from "@/lib/DAL/Controllers/userController"
import { UserModel } from "@/lib/DAL/Models"
import {
	addController,
	collectFromForm,
	collectQueries,
	getController,
} from "@/lib/DAL/controllers/universalControllers"
import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"

const config = {
	model: UserModel,
	multImages: false,
	DIR_PATH: "public/users",
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const query = collectQueries(searchParams, config)
	return getController(query, config)
}

export async function PUT(req: NextRequest) {
	const props: any = collectFromForm(await req.formData(), config)
	if (!props.name || !props.password)
		return new NextResponse("Error1!", { status: 400 })
	const hash = createHash("sha256")
	hash.update(props.password)
	hash.update(props.name)
	props.passwordHash = hash.digest("base64")
	props.role = "user"
	const res = await addController(props, config)
	if (res.status != 201)
		return new NextResponse("Error2!", { status: res.status })
	return new NextResponse("Succes", { status: 201 })
}
