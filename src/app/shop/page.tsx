import InfProductList from "@/lists/InfProductList";
import { getProductsPageAction } from "@/actions/product";
import React from "react";
import { redirect } from "next/navigation";

export default async function Shop({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	const params = new URLSearchParams(searchParams);
	const brand = params.get("brand")?.split(",");
	const category = params.get("category")?.split(",");
	const name = params.get("name") || undefined;
	const initProducts = await getProductsPageAction({
		brand,
		category,
		name,
		page: 20,
	});
	if ("error" in initProducts) redirect("./shop");

	return (
		<>
		<main className="grid size-full grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] items-center justify-items-center md:justify-items-start gap-y-4 bg-background p-5">
			<InfProductList products={initProducts} />
		</main>
		</>
	);
}
