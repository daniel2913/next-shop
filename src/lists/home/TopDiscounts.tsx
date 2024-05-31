import { DiscountCache } from "@/helpers/cache";
import { populateProducts } from "@/helpers/populateProducts";
import { ProductModel, type Product } from "@/lib/Models";
import { or, desc, and, not } from "drizzle-orm";
import HorizontalScrollList from "../../components/ui/HorizontalScrollList";
import { GenericProductList } from "../GenericProductList";
import { betterInArray } from "@/helpers/misc";

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
							betterInArray(ProductModel.table.brand, discount.brands),
							betterInArray(ProductModel.table.category, discount.categories),
							betterInArray(ProductModel.table.id, discount.products),
						),
						not(
							betterInArray(
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
