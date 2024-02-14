import { ScrollArea, ScrollBar } from "../ui/ScrollArea"
import ProductCard from "./ProductCard"
import { getProductsByIds } from "@/actions/product"
import { UserCache } from "@/helpers/cachedGeters"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function SavedProducts(){
	const session = await getServerSession(authOptions)
	const userFav = session?.user?.name
		? (await UserCache.get(session.user.name))?.saved || []
		: []
	if (userFav.length===0) return null
	const topProducts = await getProductsByIds(userFav)
	
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

