import Link from "next/link"
import { ReactElement } from "react"
import NavButton from "@/components/navbar/Navbutton"

export default function AdminLayout({ children }: { children: ReactElement }) {
	return (
		<>
		<header
				className="
				pr-[var(--removed-body-scroll-bar-size)]
				fixed left-0 right-0 top-0 z-[100]
				flex items-center h-12 mb-2
				bg-secondary px-5 animate-slide-down
				py-1 pointer-events-auto"
				>
				<NavButton
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center basis-0"
				>
				<Link href="/shop/home" 
				className="absolute size-full inset-0 basis-0" 
				/>
				Shop
				</NavButton>
				<NavButton
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center basis-0"
				>
				<Link href="/admin/orders" 
				className="absolute size-full inset-0 basis-0" 
				/>
				Orders
				</NavButton>
				<NavButton
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center basis-0"
				>
				<Link href="/admin/products" 
				className="absolute size-full inset-0 basis-0" 
				/>
				Products
				</NavButton>
				<NavButton
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center basis-0"
				>
				<Link href="/admin/brands" 
				className="absolute size-full inset-0 basis-0" 
				/>
				Brands
				</NavButton>
				<NavButton
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center basis-0"
				>
				<Link href="/admin/categories" 
				className="absolute size-full inset-0 basis-0" 
				/>
				Categories
				</NavButton>
				<NavButton
				className="basis-0 flex-auto font-semibold md:text-2xl justify-center basis-0"
				>
				<Link href="/admin/discounts" 
				className="absolute size-full inset-0 basis-0" 
				/>
				Discounts
				</NavButton>
		</header>
		<main className="h-full p-4 pt-16 w-full flex justify-center">
			{children}
		</main>
		</>
	)
}
