import { getProductsByIds } from "@/actions/product"
import { auth } from "@/actions/common"
import HorizontalScroll from "../ui/HorizontalScroll"
import SavedList from "./SavedList"
import {ProductList} from "./ProductList"

type Props = {
	className?: string
	num?: number
}



export default async function SavedProducts(props: Props) {
	try {
		const user = await auth("user")
		if (user.saved.length === 0) return  null
		const saved = props.num
			? user.saved.slice(0, props.num)
			: user.saved
		const savedProducts = await getProductsByIds(saved)
		if (savedProducts.length === 0) return null
		return (
			<>
				<h2>Saved Products</h2>
				<HorizontalScroll className={`${props.className}`}>
					<ProductList products={savedProducts}/>
				</HorizontalScroll>
			</>
		)
	}
	catch {
		return null
	}
}





