import { DiscountCache } from "@/helpers/cachedGeters"
import { populateProducts } from "@/helpers/getProducts"
import { ProductModel } from "@/lib/DAL/Models"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import {or,inArray, desc, not, eq} from "drizzle-orm"
import ProductCard from "../Product/ProductCard"

export default async function TopDiscountProducts(){
	const topDiscounts = (await DiscountCache.get())
		//.filter(discount=>+discount.expires>Date.now())
		.sort((a,b)=>a.discount-b.discount)
	const topDiscounted:PopulatedProduct[] = [] 
	let i = 0
	while (topDiscounted.length<10 && i<topDiscounts.length){

		const condition1 = topDiscounts[i].brands.length>0
			? inArray(ProductModel.table.brand,topDiscounts[i].brands)
			: eq(ProductModel.table.id,-1)
		const condition2 = topDiscounts[i].categories.length>0
			? inArray(ProductModel.table.category,topDiscounts[i].categories)
			: eq(ProductModel.table.id,-1)
		topDiscounted.push(...await populateProducts(await ProductModel.model
				.select()
				.from(ProductModel.table)
				.where(or(condition1,condition2))
				.orderBy(desc(ProductModel.table.price))
				))
		i++
	}
	return(
		<div className="
			flex overflow-x-scroll gap-2 bg-accent1-200
			flex-shrink-0 flex-grow w-fit
		">
			{topDiscounted.slice(0,10).map(product=>
				<ProductCard
					className="w-40 h-[22rem]"
					key = {product.id}
					product={product}
				/>
			)}
		</div>
	)
}
