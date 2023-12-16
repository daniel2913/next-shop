import ProductStoreProvider from "@/components/Products/productsStoreProvider"
import { getProducts } from "@/helpers/getProducts"
import { ProductProvider, useHydrate } from "@/store/productsStore/productStore"
import NavBar from "@comps/NavBar"
import Link from "next/link"
import { ReactElement } from "react"

interface LayoutProps {
	children: ReactElement[]
	modal: ReactElement
}

export default async function ShopLayout({ children }: LayoutProps) {
	return (
		<>
			{children}
		</>
	)
}
