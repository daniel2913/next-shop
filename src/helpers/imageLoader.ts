"use client";

type Props = {
	src: string;
	width: number;
	quality: number;
};

export default function imageLoader({ src, width, quality }: Props) {
	const address = new URL(
		process.env.NEXT_PUBLIC_PUBLIC_API_URL || window.origin
	);
	if (!quality) quality = 75;
	address.pathname = process.env.NEXT_PUBLIC_PUBLIC_API_PATH || "/api/public";
	address.searchParams.append("src", src);
	address.searchParams.append("w", width.toString());
	address.searchParams.append("q", quality.toString());
	return address.toString();
}
