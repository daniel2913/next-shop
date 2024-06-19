import { redirect } from "next/navigation"
import qr from "qrcode"

const base = process.env.NEXT_PUBLIC_NEXTAUTH_URL

export default async function(
	props: {
		searchParams: Record<string, string>
	}
) {
	const params = new URLSearchParams(props.searchParams)
	const code = params.get("code")
	if (!code) redirect("/shop/home")
	const url = `${base}/shop/track/${code}`
	const qrCode = await qr.toDataURL(url)
	return (
		<div className="fixed w-full md:w-2/3 right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 bg-secondary text-center flex flex-col gap-6 text-2xl justify-center items-center p-8 rounded-lg">
			<p className="text-xl md:text-4xl uppercase mb-4">Thank you for your order</p>
			<p className="text-lg md:text-2xl">Status can be tracked in your order list <br />
				or at</p>
			<a className="text-sm md:text-2xl" href={url}>{url}</a>
			<img src={qrCode} />
			<p className="text-xl md:text-2xl">/**Status can be changed in admin panel**/</p>
		</div>
	)
}
