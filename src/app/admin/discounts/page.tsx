import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { DiscountModel } from "@/lib/Models";
import DiscountsAdmin from "@comps/discount/DiscountsAdmin";

export default async function Admindiscounts(){

	const discountsPromise = DiscountModel.model.select().from(DiscountModel.table)
	const session = await getServerSession(authOptions)
	if (session?.user?.role!=="admin") redirect("/shop/home")
	const discounts = await discountsPromise
	if ("error" in discounts) throw discounts.error
	return(
		<DiscountsAdmin className="w-full" discounts={discounts}/>
	)
}
