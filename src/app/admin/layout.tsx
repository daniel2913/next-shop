import Link from "next/link"
import { ReactElement } from "react"
import NavButton from "@/components/ui/Navbutton"

export default function AdminLayout({ children }: { children: ReactElement }) {
	return (
		<>
			<header className="pointer-events-auto fixed left-0 right-0 top-0 z-[100] mb-2 flex h-12 animate-slide-down items-center bg-secondary px-5 py-1 pr-[var(--removed-body-scroll-bar-size)]">
				<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
					<Link
						href="/shop/home"
						className="absolute inset-0 size-full basis-0"
					/>
					Shop
				</NavButton>
				<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
					<Link
						href="/admin/orders"
						className="absolute inset-0 size-full basis-0"
					/>
					Orders
				</NavButton>
				<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
					<Link
						href="/admin/products"
						className="absolute inset-0 size-full basis-0"
					/>
					Products
				</NavButton>
				<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
					<Link
						href="/admin/brands"
						className="absolute inset-0 size-full basis-0"
					/>
					Brands
				</NavButton>
				<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
					<Link
						href="/admin/categories"
						className="absolute inset-0 size-full basis-0"
					/>
					Categories
				</NavButton>
				<NavButton className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
					<Link
						href="/admin/discounts"
						className="absolute inset-0 size-full basis-0"
					/>
					Discounts
				</NavButton>
			</header>
			<main className="flex h-full w-full justify-center p-4 pt-16">
				{children}
			</main>
		</>
	)
}
