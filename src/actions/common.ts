import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PgreModel } from "@/lib/DAL/Models/base"
import { getServerSession } from "next-auth"

export async function modelGeneralAction(model: PgreModel<any, any, any>, formOrProps: FormData | { [key: string]: unknown }, id?: number) {

	const session = await getServerSession(authOptions)
	if (session?.user?.role !== "admin") return "Unauthorized"

	const props = formOrProps instanceof FormData
		? parseFormData(formOrProps)
		: formOrProps

	try {
		const res = id !== undefined
			? await model.patch(id, props)
			: await model.create(props)
		if (!res) {
			return "???"
		}
		return false
	} catch (error) {
		console.error(error)
		return String(error)
	}
}

export function parseFormData(formData: FormData) {
	const POJO: any = {}
	for (const [key, value] of formData.entries()) {
		if (key in POJO) {
			if (!Array.isArray(POJO[key]))
				POJO[key] = [POJO[key], value]
			else
				POJO[key].push(value)
		}
		else
			POJO[key] = value
	}
	return POJO as { [key: string]: unknown }
}

