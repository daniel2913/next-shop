import { NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { env } from "process"

export async function GET(req: NextRequest) {
	if (env.NODE_ENV === "production")
		console.error("IMAGE SERVED BY NEXT IN PRODUCTION!")
	const url = req.url
	redirect(url.replace(":3000", ":8000"))
}
