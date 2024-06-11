import { redirect } from "next/navigation"
import { env } from "node:process"
import qr from "qrcode"

const base = env.NEXTAUTH_URL

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
		<div className="size-full min-h-screen flex justify-center items-center">
			<div className="bg-secondary text-center flex flex-col gap-6 text-2xl justify-center items-center p-8 rounded-lg -translate-y-1/3">
				<p className="text-4xl uppercase mb-4">Thank you for your order</p>
				Status can be tracked in your order list <br />
				or at
				<a href={url}>{url}</a>
				<img src={qrCode} />
				/**Status can be changed in admin panel**/
			</div>
		</div>
	)
}
