import Link from "next/link"
import { ReactElement } from "react"

export default function AdminLayout({ children }: { children: ReactElement }) {
	return (
		<>
		<header
				className="
					h-12 px-8 items-center text-3xl font-bold bg-secondary fixed left-0 right-0 top-0 flex justify-between
				">
				<Link href="/admin/orders">
					Orders
				</Link>
				<Link href="/admin/products">
					Products
				</Link>
				<Link href="/admin/brands">
					Brands
				</Link>
				<Link href="/admin/categories">
					Categories
				</Link>
				<Link href="/admin/discounts">
					Discounts
				</Link>
		</header>
		<main className="h-full p-4 pt-16 w-full flex justify-center">
			{children}
		</main>
		</>
	)
}
