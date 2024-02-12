import { populateProducts } from "@/helpers/getProducts"
import { ProductModel } from "@/lib/DAL/Models"
import { sql } from "drizzle-orm"
import { ScrollArea, ScrollBar } from "../UI/scroll-area"
import ProductCard from "../product/ProductCard"
type Props = {
	size?:number
}

export default async function TopRatingProducts({size=10}:Props){
	const topProducts = await populateProducts(
		await ProductModel.model
			.select()
			.from(ProductModel.table)
			.orderBy(sql`rating desc nulls last`)
			.limit(size))
	if (topProducts.length===0) return null
	return(
				<>
					<h2>Top Products</h2>
				<ScrollArea className="px-2 w-full overflow-y-hidden h-fit">
				<div className="flex pb-2 overflow-y-hidden h-fit w-fit gap-4 flex-shrink-0">
				{topProducts.map(product=>
				<ProductCard key={product.id} product={product}/>
				)}
					</div>
					<ScrollBar orientation="horizontal"/>
				</ScrollArea>
				</>
	)
}
