import { getRating } from "@/actions/Rating"
import { getSaved } from "@/actions/savedProducts"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { StateCreator } from "zustand"
type Products = Record<number, PopulatedProduct>
export interface ProductsSlice {
	products: PopulatedProduct[]
	getProduct: (id:number)=>PopulatedProduct|null
	loadProducts:(page:number|undefined,query:string|undefined,) => Promise<number|false>
	clearProducts: () => void
	setProducts: (products:PopulatedProduct[])=>void
	reload: ()=> void
	updateVote: (id:number,vote:number)=>Promise<false|{rating:number,voters:number}>
	toggleFav: (id:number)=>Promise<boolean>
}

async function getVotes(ids: number[]): Promise<false | Record<number, number>> {
	const res = await fetch(`/api/product/rating?id=${encodeURI(ids.toString())}`, {
		method: "GET",
	})
	if (!res.ok) return false
	return res.json()
}

async function updateVote(id: number, vote: number): Promise<false|{rating:number,voters:number}> {
	const res = await fetch("/api/product/rating", {
		method: "POST",
		body: JSON.stringify({ id, vote }),
	})
	if (!res.ok) return false
	else return res.json()
}

async function getProducts(skip:number,page:number|undefined=10,query:string|undefined): Promise<false | PopulatedProduct[]> {
	const res = await fetch(`/api/product?skip=${skip}&page=${page}&${query || ''}`, {
		method: "GET",
	})
	if (!res.ok) return false
	const list:PopulatedProduct[] = await res.json()
	return list
}

export const createProductsSlice: StateCreator<ProductsSlice> = (set, get) => ({
	products:[] as PopulatedProduct[],
	loadProducts: async (page:number|undefined,query:string|undefined) => {
		const newProducts = await getProducts(Object.keys(get().products).length,page,query)
		if (!newProducts) return false
		set(state => ({products:[ ...state.products, ...newProducts]}))
		return newProducts.length
	},
	setProducts: (products:PopulatedProduct[])=>set((state)=>({...state,products:products}),true),
	reload: async () =>{
		const products = get().products
		const [votes,favs] = await Promise.all([
				getRating(Object.keys(products).map(Number)),
				getSaved()
			]) 		
		for (const product of products){
			product.ownVote = votes[product.id] || -1
			product.favourite = favs.includes(product.id)
		}
		set(state=>({...state,products:[...products]}))
	},
	updateVote: async (id:number,vote:number)=>{
			const res = await updateVote(id,vote)
			if (!res) return false
			const products = get().products
			let productIdx = products.findIndex(prod=>prod.id===id)
			if (productIdx===-1) return false
			const product = {...products[productIdx],rating:res.rating,voters:res.voters,ownVote:vote}
			products[productIdx] = product
			set(state=>({products:[...products]}))
			return res
		},
	clearProducts: () => set((state)=>{
		return {...state,products: []}
	},true),
	getProduct: (id:number)=>{
		return get().products.find(prod=>prod.id===id) || null
	}

})
