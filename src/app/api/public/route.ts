
import fs from "fs/promises"
import _path from "path"
import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export async function GET(req: NextRequest) {
	const params = new URL(req.url).searchParams
	const src = params.get('src')
	if (!src || src.split('.').pop() !== "jpg") return NextResponse.error()
	const accepts = req.headers.get("Accept")
	if (!accepts) return NextResponse.error()
	let ext = "jpeg"
	if (accepts.includes("webp"))
		ext = "webp"
	if (accepts?.includes("avif"))
		ext = "avif"
	const publicDir = __dirname.split(".next")[0] + "public"
	const width = Number(params.get("w") || 1024)
	const quality = Number(params.get("q") || 75)
	try{
		await fs.access(`${publicDir}/${src}`)
	}
	catch{
		return NextResponse.error()
	}
	const optName = 
		"optimized/"+
		src.split(".").shift()+
		`w${width}q${quality}`+
		"."+ext
	try{
		await fs.access(`${publicDir}/${optName}`)
	}
	catch{
		const orig = await fs.readFile(`${publicDir}/${src}`)
		let optImage = sharp(orig).resize(width)
		const buf = await optImage.toFormat(ext,{quality}).toBuffer()
		await fs.writeFile(`${publicDir}/${optName}`,buf)
		return new NextResponse(buf,{headers:{"Content-Type":"image"}})
	}
	try{
	const data = await fs.readFile(`${publicDir}/${optName}`)
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
