import { Hono } from "https://deno.land/x/hono/mod.ts";
import { compress } from "https://deno.land/x/hono@v4.0.4/middleware.ts"
import sharp from "npm:sharp@0.33.2";


const app = new Hono();
app.use(compress())
app.get("/api/public", async (c) => {
  const { src, w, q } = c.req.query();
  const accept = c.req.header("accept");
  let format = "jpg";
	if (!accept) format = "jpg"
	else if (accept.includes("webp")) format = "webp";
  if (typeof src !== "string" || Number.isNaN(+w) || Number.isNaN(q)) {
    return c.notFound();
  }
  const path = decodeURIComponent(src);
  if (path.includes("..")) return c.notFound();
  const optimized = `./public/optimized${
    src.split(".").shift()
  }w${w}q${q}.${format.toLowerCase()}`;
	const headers = {
		"Content-Type":`image/${format.toLowerCase()}`,
		"Cache-Control": `max-age=${60*5}, stale-while-revalidate=${60*60*24}`
	}
  try {
    const file = await Deno.readFile(optimized);
    return new Response(file, {
      headers 
    });
  } catch {
    try {
      const buf = await Deno.readFile(`./public/${path}`);
      const opt = sharp(buf).resize(+w);
      const res = await opt.toFormat(format, { quality: +q }).toBuffer();
      Deno.writeFile(optimized, res);
      return new Response(res, {
        status: 200,
        headers
      });
    } catch {
      return c.notFound();
    }
  }
});
Deno.serve(app.fetch);
