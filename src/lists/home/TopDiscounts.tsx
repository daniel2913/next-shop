import { DiscountCache } from "@/helpers/cache";
import { populateProducts } from "@/helpers/populateProducts";
import { ProductModel, type Product } from "@/lib/Models";
import { or, desc, and, not, Column } from "drizzle-orm";
import HorizontalScrollList from "../../components/ui/HorizontalScrollList";
import { GenericProductList } from "../GenericProductList";
import { bindIfParam, sql } from "drizzle-orm";
import { ServerError } from "@/actions/common";

type Props = {
	className?: string;
};

export default async function TopDiscountProducts(props: Props) {
	const topDiscounts = (await DiscountCache.get())
		.filter((discount) => +discount.expires > Date.now())
		.sort((a, b) => a.discount - b.discount);
	const topDiscounted: Product[] = [];

	for (const discount of topDiscounts) {
		topDiscounted.push(
			...(await ProductModel.model
				.select()
				.from(ProductModel.table)
				.where(
					and(
						or(
							inArrayNoThrow(ProductModel.table.brand, discount.brands),
							inArrayNoThrow(ProductModel.table.category, discount.categories),
							inArrayNoThrow(ProductModel.table.id, discount.products),
						),
						not(
							inArrayNoThrow(
								ProductModel.table.id,
								topDiscounted.map((prod) => prod.id),
							),
						),
					),
				)
				.orderBy(desc(ProductModel.table.price))),
		);
		if (topDiscounted.length >= 10) break;
	}
	if (topDiscounted.length === 0) return null;
	const products = await populateProducts(topDiscounted.slice(0, 10));
	return (
		<>
			<h2>Top Discounts</h2>
			<HorizontalScrollList className={props.className}>
				<GenericProductList products={products} />
			</HorizontalScrollList>
		</>
	);
}

function inArrayNoThrow(column: Column, values: any[]) {
	if (Array.isArray(values)) {
		if (values.length === 0) {
			return sql`1 = 0`
		}
		return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} in ${bindIfParam(values, column)}`;
}
