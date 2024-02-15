import { ScrollArea, ScrollBar } from "../ui/ScrollArea"
import ProductCard from "./ProductCard"
import { getProductsByIds } from "@/actions/product"
import { auth } from "@/actions/common"

export default async function SavedProducts(){
	try{
		const user = await auth("user")
	if (user.saved.length===0) return null
	const topProducts = await getProductsByIds(user.saved)
	return(
				<>
				<h2>Saved Products</h2>
				<ScrollArea className="scroll-m-56 px-2 w-full overflow-y-hidden h-fit">
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
	catch{
		return null
	}
}

