import fs from "fs/promises"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	const query = new URL(req.url).pathname.split("/")
	let path = ""
	for (let i = query.pop(); i != "public"; i = query.pop()) {
		path = i + "\\" + path
	}
	path = path.slice(0, path.length - 1)
	const publicDir = __dirname.split(".next")[0] + "public\\"
	try {
		const data = await fs.readFile(publicDir + path)
		return new NextResponse(data, {
			status: 200,
			headers: {
				"Content-Type": "image",
			},
		})
	} catch (error) {
		return NextResponse.json(false, {
			status: 404,
		})
	}
}
