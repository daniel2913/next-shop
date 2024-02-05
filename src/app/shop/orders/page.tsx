import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OrderList from "@/components/cart/Orders";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function OrderPage(){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role) redirect(`/api/auth/signin?redirect=${encodeURIComponent("/shop/order")}`)
	return(
		<div className="h-full flex justify-center items-center">
			<OrderList/>
		</div>
	)
}
