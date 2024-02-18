import {createWithEqualityFn} from "zustand/traditional"
import { getRatingAction, updateVoteAction } from "@/actions/vote"
import { getProductsByIdsAction, getProductsPageAction } from "@/actions/product"
import { getSavedAction, toggleSavedAction } from "@/actions/savedProducts"
import { PopulatedProduct } from "@/lib/Models/Product"
import { ServerErrorType } from "@/hooks/useAction"

export interface ProductsSlice {
	products: PopulatedProduct[]
	loadProducts:(page:number|undefined,query:URLSearchParams,) => Promise<number|false>
	navigate:(query:URLSearchParams,page?:number)=>void
	reload: ()=> Promise<false|ServerErrorType>
	reloadSingle: (id:number)=>Promise<PopulatedProduct|ServerErrorType>
	updateVote: (id:number,vote:number)=>Promise<ServerErrorType|{rating:number,voters:number}>
	toggleFav: (id:number)=>Promise<boolean|ServerErrorType>
	inited:boolean
}
async function queryProducts(query:URLSearchParams,skip?:number,page?:number){
	const res = await getProductsPageAction({
			skip,
			page,
			brand: query.getAll("brand"),
			category: query.getAll("category"),
			name: query.get("name") || undefined
	})
	if ("error" in res)	return false
	return res
}


const useProductStore = createWithEqualityFn<ProductsSlice>()((set,get) => ({
	inited:false,
	products:[],
	loadProducts: async (page:number|undefined,query:URLSearchParams) => {
		const oldProductIds = get().products.map(prod=>prod.id)
		const res = await queryProducts(query,Object.keys(get().products).length,page,)
		if (!res)	return false
		const newProducts = res.filter(prod=>!oldProductIds.includes(prod.id))
		if (!newProducts) return false
		set(state => ({products:[ ...state.products, ...newProducts],inited:true}))
		return newProducts.length
	},
	navigate: async(query,page=20)=>{
		const products = await queryProducts(query,0,page)
		if (!products) return false
		set({products})
		return products.length
	},
	reloadSingle: async(id)=>{
		const oldProducts = get().products
		const idx = oldProducts.findIndex(prod=>prod.id===id)
		if (idx===-1) return {error:"Something is broken",title:"Client Error"}
		const res = await getProductsByIdsAction(id)
		if ("error" in res) return res
		set({products:oldProducts.with(idx,res[0])})
		return res[0]
	},
	reload: async () =>{
		const products = get().products
		if (products.length===0) return false
		const [votes,favs] = await Promise.all([
				getRatingAction(products.map(p=>p.id)),
				getSavedAction()
			]) 
		if ("error" in votes) return votes
		if ("error" in favs) return favs
		const newProducts = products.map(prod=>(
			{
				...prod,
				ownVote:votes[prod.id] ?? -1,
				favourite: favs.includes(prod.id)
			}
		))
		set({products:newProducts})
		return false
	},
	updateVote: async (id:number,vote:number)=>{
			const res = await updateVoteAction(id,vote)
			if ("error" in res) return res
			const products = get().products
			const productIdx = products.findIndex(prod=>prod.id===id)
			if (productIdx===-1) return res
			const product = {...products[productIdx],rating:res.rating,voters:res.voters,ownVote:vote}
			set({products:products.with(productIdx,product)})
			return res
		},
	toggleFav: async (id: number) => {
		const res = await toggleSavedAction(id)
		if (typeof res === "object" && "error" in res) return res
		const oldProducts = get().products
		const prodIdx = oldProducts.findIndex(prod=>prod.id===id)
		if (prodIdx===-1) return res
		const newProds = [...oldProducts]
		newProds[prodIdx].favourite=res
		set({ products: newProds})
		return res
	},
}))
export default useProductStore
