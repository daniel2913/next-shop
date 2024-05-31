import { Hono } from "hono";
//import { compress } from "hono/compress"
import fs from "node:fs/promises"
import sharp from "sharp";


const app = new Hono();
//app.use(compress())
app.get("/api/public", async (c) => {
	const { src, w, q } = c.req.query();
	const accept = c.req.header("accept");
	let format: "jpg" | "webp" = "jpg";
	if (!accept) format = "jpg"
	else if (accept.includes("webp")) format = "webp";
	if (typeof src !== "string" || Number.isNaN(+w) || Number.isNaN(q)) {
		return c.notFound();
	}
	const path = decodeURIComponent(src);
	if (path.includes("..")) return c.notFound();
	const optimized = `./public/optimized${src.split(".").shift()
		}w${w}q${q}.${format.toLowerCase()}`;
	const headers = {
		"Content-Type": `image/${format.toLowerCase()}`,
		"Cache-Control": `max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24}`
	}
	try {
		const file = Bun.file(optimized);
		if (! await file.exists()) throw ""
		return new Response(file, {
			headers
		});
	} catch {
		try {
			const buf = Bun.file(`./public/${path}`);
			const opt = sharp(await buf.arrayBuffer()).resize(+w);
			const res = await opt.toFormat(format, { quality: +q }).toBuffer();
			await Bun.write(optimized, res);
			return new Response(res, {
				status: 200,
				headers
			});
		} catch {
			return c.notFound();
		}
	}
});

export default {
	fetch: app.fetch,
	port: 3005
}
