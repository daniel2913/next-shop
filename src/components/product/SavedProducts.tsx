import { ScrollArea, ScrollBar } from "../ui/ScrollArea"
import ProductCard from "./ProductCard"
import { getProductsByIds } from "@/actions/product"
import { auth } from "@/actions/common"
import HorizontalScroll from "../ui/HorizontalScroll"

type Props = {
	className?: string
}

export default async function SavedProducts(props:Props){
	try{
		const user = await auth("user")
	if (user.saved.length===0) return null
	const topProducts = await getProductsByIds(user.saved)
	if (topProducts.length===0) return null
	return(
				<>
				<h2>Saved Products</h2>
				<HorizontalScroll className={`${props.className}`}>
				{topProducts.map(product=>
				<ProductCard key={product.id} product={product}/>
				)}
				</HorizontalScroll>
				</>
	)
	}
	catch{
		return null
	}
}

