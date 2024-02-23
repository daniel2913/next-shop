import Link from "next/link"
import { ReactElement } from "react"
import NavButton from "@/components/ui/Navbutton"
import { auth } from "@/actions/common"
import { redirect } from "next/navigation"
import NavBarContainer from "@/components/navbar/NavbarContainer"

export default async function AdminLayout({ children }: { children: ReactElement }) {
	try{
	await auth("admin")
	return (
		<>
			<NavBarContainer>
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
			</NavBarContainer>
			<main className="flex h-full w-full justify-center p-4 pt-16">
				{children}
			</main>
		</>
	)
	}
	catch{
		redirect("/shop/home")
	}
}
