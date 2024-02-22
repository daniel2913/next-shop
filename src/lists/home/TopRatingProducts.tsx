import { populateProducts } from "@/helpers/populateProducts"
import { ProductModel } from "@/lib/Models"
import { sql } from "drizzle-orm"
import HorizontalScrollList from "../../components/ui/HorizontalScrollList"
import { GenericProductList } from "../GenericProductList"

type Props = {
	size?: number
	className?: string
}

export default async function TopRatingProducts(props: Props) {
	const topProducts = await populateProducts(
		await ProductModel.model
			.select()
			.from(ProductModel.table)
			.orderBy(sql`votes desc nulls last`)
			.limit(props.size || 10)
	)
	if (topProducts.length === 0) return null
	return (
		<>
			<h2>Top Rating</h2>
			<HorizontalScrollList className={props.className}>
				<GenericProductList products={topProducts} />
			</HorizontalScrollList>
		</>
	)
}
