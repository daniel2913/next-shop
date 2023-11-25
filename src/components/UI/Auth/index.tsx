import Link from "next/link"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"

interface props {
	className?: string
}

export default async function Auth({ className }: props) {
	const session = await getServerSession(authOptions)
	const name = session?.user?.name ? session?.user?.name : "Guest"
	return (
		<div className={`${className}`}>
			{session?.user?.name ? (
				<div className="grid">
					<Link href={`/profile/${name}`}>{name}</Link>
					<Link href="/api/auth/signout">Log out</Link>
				</div>
			) : (
				<div className="grid">
					<span>{name}</span>
					<Link href="/api/auth/signin">Log in</Link>
				</div>
			)}
		</div>
	)
}
