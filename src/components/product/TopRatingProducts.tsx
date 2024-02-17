import { populateProducts } from "@/helpers/getProducts"
import { ProductModel } from "@/lib/Models"
import { sql } from "drizzle-orm"
import ProductCard from "./ProductCard"
import HorizontalScroll from "../ui/HorizontalScroll"

type Props = {
	size?:number
	className?:string
}

export default async function TopRatingProducts(props:Props){
	const topProducts = await populateProducts(
		await ProductModel.model
			.select()
			.from(ProductModel.table)
			.orderBy(sql`rating desc nulls last`)
			.limit(props.size||10))
	if (topProducts.length===0) return null
	return(
				<>
					<h2>Top Products</h2>
				<HorizontalScroll className={props.className}>
				{topProducts.map(product=>
				<ProductCard key={product.id} product={product}/>
				)}
				</HorizontalScroll>
				</>
	)
}
