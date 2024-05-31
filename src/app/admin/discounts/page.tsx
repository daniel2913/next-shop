import React from "react";
import { DiscountModel } from "@/lib/Models";
import DiscountsAdmin from "@/components/admin/discounts/DiscountsAdmin";

export default async function AdminDiscountsPage() {
	const discountsPromise = DiscountModel.model
		.select()
		.from(DiscountModel.table);
	const discounts = await discountsPromise;
	if ("error" in discounts) throw discounts.error;
	return <DiscountsAdmin className="w-full" discounts={discounts} />;
}
