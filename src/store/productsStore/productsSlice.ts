import { getRating, updateVoteAction } from "@/actions/vote"
import { getProductsByIdsAction, getProductsPageAction } from "@/actions/product"
import { addSaved, deleteSaved, getSaved } from "@/actions/savedProducts"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { StateCreator } from "zustand"
type Products = Record<number, PopulatedProduct>
export interface ProductsSlice {
	products: PopulatedProduct[]
	getProduct: (id:number)=>PopulatedProduct|null
	loadProducts:(page:number|undefined,query:URLSearchParams,) => Promise<number|false>
	clearProducts: () => void
	setProducts: (products:PopulatedProduct[])=>void
	reload: ()=> void
	reloadSingle: (id:number)=>Promise<PopulatedProduct|null>
	updateVote: (id:number,vote:number)=>Promise<false|{rating:number,voters:number}>
	toggleFav: (id:number)=>Promise<false|string>
}


export const createProductsSlice: StateCreator<ProductsSlice> = (set, get) => ({
	products:[] as PopulatedProduct[],
	loadProducts: async (page:number|undefined,query:URLSearchParams) => {
		const oldProductIds = get().products.map(prod=>prod.id)
		const newProducts = (await getProductsPageAction({
				skip:Object.keys(get().products).length,
				page,
				brand: query.getAll("brand"),
				category: query.getAll("category"),
				name: query.get("name") || undefined
		}))
			.filter(prod=>!oldProductIds.includes(prod.id))
		if (!newProducts) return false

		set(state => ({products:[ ...state.products, ...newProducts]}))
		return newProducts.length
	},
	setProducts: (products:PopulatedProduct[])=>set((state)=>({...state,products:products}),true),
	reloadSingle: async(id)=>{
		const oldProducts = get().products
		const idx = oldProducts.findIndex(prod=>prod.id===id)
		if (idx===-1) return null
		const product = await getProductsByIdsAction(id.toString())
		if (!product[0]) return null
		set({products:oldProducts.with(idx,product[0])})
		return product[0]
	},
	reload: async () =>{
		const products = get().products
		const [votes,favs] = await Promise.all([
				getRating(products.map(p=>p.id)),
				getSaved()
			]) 
		const newProducts = products.map(prod=>(
			{
				...prod,
				ownVote:votes[prod.id] || -1,
				favourite: favs.includes(prod.id)
			}
		))
		set({products:newProducts})
	},
	updateVote: async (id:number,vote:number)=>{
			const res = await updateVoteAction(id,vote)
			console.log(res)
			if (!res || typeof res ==="string") return false
			const products = get().products
			let productIdx = products.findIndex(prod=>prod.id===id)
			if (productIdx===-1) return false
			const product = {...products[productIdx],rating:res.rating,voters:res.voters,ownVote:vote}
			set({products:products.with(productIdx,product)})
			console.log("check")
			return res
		},
	toggleFav: async (id: number) => {
		const oldProds = get().products
		const prod = oldProds.find(prod=>prod.id===id)
		if (!prod) return "Prdoduct Not Found"
		let action: null | ((id: number) => Promise<false|string>) = null
		if (prod.favourite) {
			action = deleteSaved
		}
		else {
			action = addSaved
		}
		const prodIdx = oldProds.findIndex(prod=>prod.id===id)
		const newProds = [...oldProds]
		newProds[prodIdx].favourite=!newProds[prodIdx].favourite
			
		const res = action(id)
		set({ products: newProds})
		if (await res) return res
		set({products:oldProds})
		return false
	},
	clearProducts: () => set((state)=>{
		return {...state,products: []}
	},true),
	getProduct: (id:number)=>{
		return get().products.find(prod=>prod.id===id) || null
	}

})
