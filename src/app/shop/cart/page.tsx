import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Cart from "@/components/cart/Cart";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CartPage(){
	const session = await getServerSession(authOptions)
	console.log()
	if (!session || session.user?.role!=="user") redirect(`/api/auth/signin?redirect=${encodeURIComponent("/shop/cart")}`)
	return(
		<div className="h-full flex justify-center items-center">
			<Cart/>
		</div>
	)
}
