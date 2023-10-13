import { Item, Product } from '@/lib/DAL/MongoModels'
import { Ref } from '@typegoose/typegoose'
import { StateCreator } from 'zustand'
export interface cartSlice {
    items: Item[]
    addItem: (item: Product) => void
    discardItem: (id: string) => void
    setAmmount: (id: string, amnt: number) => void
    setItems: (items: Item[]) => void
}

export const validCartItemProps = [
    'id',
    'name',
    'link',
    'ammount',
    'price',
] as const

export const createCartSlice: StateCreator<cartSlice> = (set, get) => ({
    items: [],
    addItem: (item: Product) => {
        set((state) => {
            const newItems = state.items
            newItems.push({ amount: 1, product: item._id as Ref<Product> })
            console.log(newItems)
            return { items: newItems }
        })
    },
    setItems: (items: Item[]) => {
        set((state) => {
            return { items }
        })
    },
    discardItem: (id: string) => {
        set((state) => {
            const newItems = state.items.filter(
                (item) => item.product.toString() != id
            )
            return { items: newItems }
        })
    },
    setAmmount: (id: string, amnt: number) => {
        set((state) => {
            const newItems = state.items.map((item) => {
                if (item.product.toString() === id)
                    item.amount = amnt > 0 ? amnt : 0
                return item
            })
            return { items: newItems }
        })
    },
})
