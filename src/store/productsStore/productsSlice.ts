import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { StateCreator } from "zustand"
type Products = Record<number, PopulatedProduct>
export interface ProductsSlice {
	products: Products
	loadProducts:(page:number|undefined,query:string|undefined,) => Promise<number|false>
	clearProducts: () => void
	setProducts: (products:Products)=>void
	getProducts: ()=> PopulatedProduct[]
	reloadVotes: ()=> void
	updateVote: (id:number,vote:number)=>Promise<false|{rating:number,voters:number}>
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

async function getProducts(skip:number,page:number|undefined=10,query:string|undefined): Promise<false | Record<number,PopulatedProduct>> {
	const res = await fetch(`/api/product?skip=${skip}&page=${page}&${query || ''}`, {
		method: "GET",
	})
	if (!res.ok) return false
	const list:PopulatedProduct[] = await res.json()
	const products = list.map(prod=>[prod.id,prod])
	return Object.fromEntries(products)
}

export const createProductsSlice: StateCreator<ProductsSlice> = (set, get) => ({
	products:{} as Products,
	loadProducts: async (page:number|undefined,query:string|undefined) => {
		const newProducts = await getProducts(Object.keys(get().products).length,page,query)
		if (!newProducts) return false
		set(state => ({products:{ ...state.products, ...newProducts}}))
		return Object.keys(newProducts).length
	},
	setProducts: (products:Products)=>set((state)=>({...state,products:products}),true),
	reloadVotes: async () =>{
		const products = get().products
		const votes = await getVotes(Object.keys(products).map(Number))
		if (!votes) return true
		for (const [id,vote] of Object.entries(votes)){
			products[+id].ownVote = vote
		}
		set(state=>({...state,products:{...products}}))
	},
	updateVote: async (id:number,vote:number)=>{
			const res = await updateVote(id,vote)
			if (!res) return false
			const product = get().products[id]
			product.ownVote = vote
			product.rating = res.rating
			product.voters = res.voters
			set(state=>({products:{...state.products,[product.id]:{...product}}}))
			return res
		},
	clearProducts: () => set((state)=>{
		return {...state,products: []}
	},true),
	getProducts: ()=> Object.values(get().products)

})
