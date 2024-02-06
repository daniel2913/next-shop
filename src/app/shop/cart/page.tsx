import { getProductsByIds } from "@/actions/product";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CartTable } from "@/components/cart/Cart";
import { UserCache } from "@/helpers/cachedGeters";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CartPage(){
	const session = await getServerSession(authOptions)
	if (!session || session.user?.role!=="user") redirect(`/api/auth/signin?redirect=${encodeURIComponent("/shop/cart")}`)
	const referer = headers().get("referer")
	if (!referer || new URL(referer).host !== "localhost:3000")
		redirect("/shop")
	const user = await UserCache.get(session.user.name)
	if (!user) throw "Bad Cache"
	const products = await getProductsByIds(Object.keys(user.cart).map(Number))
	return(
		<div className="min-h-full w-screen overflow-x-hidden">
			<CartTable products={products}/>
		</div>
	)
}
