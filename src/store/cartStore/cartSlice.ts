import { ProductModel } from '@/lib/DAL/MongoModels'
import { StateCreator } from 'zustand'
import { updateCartCache } from '@/hooks/cart/useCartCache'

export interface cartItem {
    id: string
    name: string
    ammount: number
	price:number
	link: string
}

export interface cartSlice{
	items:cartItem[]
	addItem: (item:cartItem)=>void
	discardItem: (id:string)=>void
	setAmmount: (id:string,amnt:number)=>void
}

export const validCartItemProps = ['id', 'name', 'ammount','price','link'] as const

export const createCartSlice: StateCreator<cartSlice> = (set) => ({
    items:[],
    addItem: (item: cartItem) => {
		set((state) => {
			const newItems = state.items
			newItems.push(item)
			updateCartCache(newItems)
			console.log(newItems)
			return { items: newItems }
		})
	},
    discardItem: (id: string) =>{
        set((state) => {
			const newItems = state.items.filter((item) => item.id != id)
			updateCartCache(newItems)
			return {items: newItems }
		})
	},
    setAmmount: (id: string,amnt:number) =>{
        set((state) => {
			const newItems = state.items.map((item) => {
                if (item.id === id) item.ammount = amnt>0 ? amnt : 0
                return item
            })
			updateCartCache(newItems)
			return {items: newItems}
		})
	},
})
