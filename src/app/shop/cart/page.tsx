import { auth } from "@/actions/common"
import { getProductsByIdsAction } from "@/actions/product"
import Cart from "@/components/cart"
import { redirect } from "next/navigation"

export default async function CartPage() {
	try {
		const user = await auth("user")
		const prodIds = Object.keys(user.cart).map(Number)
		const products = await getProductsByIdsAction(prodIds)
		if ("error" in products) redirect("/shop/home")
		return (
			<Cart
				products={products}
				initCart={user.cart}
			/>
		)
	} catch {
		redirect("/shop/home")
	}
}
