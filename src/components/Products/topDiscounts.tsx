import { DiscountCache } from "@/helpers/cachedGeters"
import { populateProducts } from "@/helpers/getProducts"
import { ProductModel } from "@/lib/DAL/Models"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import {or,inArray, desc, not, eq} from "drizzle-orm"
import ProductCard from "../product/ProductCard"
import { ScrollArea, ScrollBar } from "../UI/scroll-area"

export default async function TopDiscountProducts(){
	const topDiscounts = (await DiscountCache.get())
		.filter(discount=>+discount.expires>Date.now())
		.sort((a,b)=>a.discount-b.discount)
	const topDiscounted:PopulatedProduct[] = [] 

	for (const discount of topDiscounts){
		const condition1 = discount.brands.length>0
			? inArray(ProductModel.table.brand,discount.brands)
			: eq(ProductModel.table.id,-1)
		const condition2 = discount.categories.length>0
			? inArray(ProductModel.table.category,discount.categories)
			: eq(ProductModel.table.id,-1)
		topDiscounted.push(...await populateProducts(await ProductModel.model
				.select()
				.from(ProductModel.table)
				.where(or(condition1,condition2))
				.orderBy(desc(ProductModel.table.price))
				))
		if (topDiscounted.length>=10) break
	}
	if (topDiscounted.length===0) return null
	return(
				<ScrollArea className="px-2 w-full overflow-y-hidden h-fit">
				<div className="flex pb-2 overflow-y-hidden h-fit w-fit gap-4 flex-shrink-0">
			{topDiscounted.slice(0,10).map(product=>
				<ProductCard
					key = {product.id}
					product={product}
				/>
			)}
			</div>
			<ScrollBar/>
		</ScrollArea>
	)
}
