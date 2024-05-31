import { auth } from "@/actions/common";
import { getProductsByIdsAction } from "@/actions/product";
import Cart from "@/components/cart";
import RequireAuth from "@/providers/RequireAuth";
import { redirect } from "next/navigation";

export default async function CartPage() {
	try {
		const user = await auth("user");
		const prodIds = Object.keys(user.cart).map(Number);
		const products = await getProductsByIdsAction(prodIds);
		if ("error" in products) redirect("/shop/home");
		return (
			<RequireAuth>
				<Cart products={products} initCart={user.cart} />
			</RequireAuth>
		)
	} catch {
		redirect("/shop/home");
	}
}
