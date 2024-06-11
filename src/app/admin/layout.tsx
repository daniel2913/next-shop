import Link from "next/link";
import type { ReactElement } from "react";
import NavButton from "@/components/ui/Navbutton";
import { auth } from "@/actions/auth";
import { redirect } from "next/navigation";
import NavBarContainer from "@/components/navbar/NavbarContainer";
import { cookies } from "next/headers";

export default async function AdminLayout({
	children,
}: {
	children: ReactElement;
}) {
	try {
		const cookie = cookies().get("cookie")
		if (cookie) throw "Error"
		await auth("admin")
		return (
			<>
				<NavBarContainer>
					<NavButton tabIndex={-1} className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
						<Link
							href="/shop/home"
							className="absolute inset-0 size-full basis-0"
						/>
						Shop
					</NavButton>
					<NavButton tabIndex={-1} className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
						<Link
							href="/admin/orders"
							className="absolute inset-0 size-full basis-0"
						/>
						Orders
					</NavButton>
					<NavButton tabIndex={-1} className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
						<Link
							href="/admin/products"
							className="absolute inset-0 size-full basis-0"
						/>
						Products
					</NavButton>
					<NavButton tabIndex={-1} className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
						<Link
							href="/admin/brands"
							className="absolute inset-0 size-full basis-0"
						/>
						Brands
					</NavButton>
					<NavButton tabIndex={-1} className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
						<Link
							href="/admin/categories"
							className="absolute inset-0 size-full basis-0"
						/>
						Categories
					</NavButton>
					<NavButton tabIndex={-1} className="flex-auto basis-0 justify-center font-semibold md:text-2xl">
						<Link
							href="/admin/discounts"
							className="absolute inset-0 size-full basis-0"
						/>
						Discounts
					</NavButton>
				</NavBarContainer>
				<main className="flex h-full w-full justify-center p-4">
					{children}
				</main>
			</>
		);
	} catch {
		redirect("/shop/home");
	}
}
