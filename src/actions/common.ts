import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PgreModel } from "@/lib/DAL/Models/base"
import { DrizzleError } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { PostgresError } from "postgres"
import { ZodError } from "zod"



export async function modelGeneralAction(model: PgreModel<any, any>, formOrProps: FormData | Record<string,unknown>, id?: number) {

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
			throw "???"
		}
		if (res instanceof DrizzleError) throw res.message
		if (res instanceof Error) throw res.message
		return false
	} catch (error) {
		console.log(error)
		console.log(Object.getPrototypeOf(error))
		if (error instanceof ZodError)
			throw error.format()._errors
		if (error instanceof DrizzleError)
			throw error.message
		if (error instanceof Error)
			throw error.message
		else throw String(error)
	}
}

export async function modelGeneralActionNoAuth(model: PgreModel<any, any>, formOrProps: FormData | Record<string,unknown>, id?: number) {

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
		if (value instanceof File && value.size===0) continue
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

