"use client";

import { env } from "process";

type Props = {
	src: string;
	width: number;
	quality: number;
};

export default function imageLoader({ src, width, quality }: Props) {
	const address = new URL(
		env.NEXTAUTH_URL || `${window.location.protocol}//${window.location.host}`,
	);
	if (!quality) quality = 75;
	address.pathname = env.PUBLIC_API_PATH || "/api/public";
	address.searchParams.append("src", src);
	address.searchParams.append("w", width.toString());
	address.searchParams.append("q", quality.toString());
	return address.toString();
}
