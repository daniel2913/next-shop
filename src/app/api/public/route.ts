
import { NextRequest} from "next/server"
import { redirect } from "next/navigation"

export async function GET(req: NextRequest) {
	const url = req.url
	redirect(url.replace(":3000",":8000"))
}
