import { DiscountCache } from "@/helpers/cachedGeters"
import { populateProducts } from "@/helpers/getProducts"
import { ProductModel, Product } from "@/lib/Models"
import {or,inArray, desc, eq} from "drizzle-orm"
import ProductCard from "./ProductCard"
import HorizontalScroll from "../ui/HorizontalScroll"

type Props = {
	className?:string
}

export default async function TopDiscountProducts(props:Props){
	const topDiscounts = (await DiscountCache.get())
		.filter(discount=>+discount.expires>Date.now())
		.sort((a,b)=>a.discount-b.discount)
	const topDiscounted:Product[] = [] 

	for (const discount of topDiscounts){
		const condition1 = discount.brands.length>0
			? inArray(ProductModel.table.brand,discount.brands)
			: eq(ProductModel.table.id,-1)
		const condition2 = discount.categories.length>0
			? inArray(ProductModel.table.category,discount.categories)
			: eq(ProductModel.table.id,-1)
		const condition3 = discount.products.length>0
			? inArray(ProductModel.table.id,discount.products)
			: eq(ProductModel.table.id,-1)
		topDiscounted.push(...await ProductModel.model
				.select()
				.from(ProductModel.table)
				.where(or(condition1,condition2,condition3))
				.orderBy(desc(ProductModel.table.price))
				)
		if (topDiscounted.length>=10) break
	}
	if (topDiscounted.length===0) return null
	const products = await populateProducts(topDiscounted.slice(0,10))
	return(
		
			<HorizontalScroll className={props.className}>
			{products.map(product=>
				<ProductCard
			key = {product.id}
					product={product}
				/>
			)}
			</HorizontalScroll>
	)
}
