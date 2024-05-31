import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";

let seen = false

export async function GET(req: NextRequest) {
	const url = req.url;
	if (!seen){
		console.error("Next router used for media request redirects")
		seen = true
	}
	redirect(url.replace(":3000", ":3005"));
}
