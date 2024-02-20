import ProductCard from "./ProductCard"
import { getProductsByIds } from "@/actions/product"
import { auth } from "@/actions/common"
import HorizontalScroll from "../ui/HorizontalScroll"
import { useItems } from "@/hooks/useInfScroll"

type Props = {
	className?: string
}


export async function SavedProductsNaked({num}:{num?:number}){
	try{
		const user = await auth("user")
	if (user.saved.length===0) return null
	const saved = num 
		? user.saved.slice(0,num)
		: user.saved
	const savedProducts = await getProductsByIds(saved)
	const products = useItems({initItems:savedProducts,getItems:getProducts})
	if (savedProducts.length===0) return null
	return(
			<>
				{savedProducts.map(product=>
				<ProductCard key={product.id} {...product}/>
				)}
			</>
	)
	}
	catch{
		return null
	}
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
					<SavedProductsNaked num={10}/>
				</HorizontalScroll>
				</>
	)
	}
	catch{
		return null
	}
}





