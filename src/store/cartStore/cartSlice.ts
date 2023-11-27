import { StateCreator } from "zustand"

interface Item
{productId:number, amount:number}
export interface CartSlice {
	items: Item[]
	addItem: (item: number) => void
	discardItem: (id: number) => void
	setAmmount: (id: number, amnt: number) => void
	setItems: (items: Item[]) => void
}

export const validCartItemProps = [
	"id",
	"name",
	"link",
	"ammount",
	"price",
] as const

function updateAccount(cart: Item[]) {
	fetch("/api/store", {
		method: "PATCH",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(cart),
	})
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
	items:[],
	addItem: (id: number) => {
		set((state) => {
			const newItems = state.items
			newItems.push({ amount: 1, productId: id })
			updateAccount(newItems)
			return { items: newItems }
		})
	},
	setItems: (items: Item[]) => {
		set((state) => {
			return { items }
		})
	},
	discardItem: (id: number) => {
		set((state) => {
			const newItems = state.items.filter((item) => item.productId !== id)
			updateAccount(newItems)
			return { items: newItems }
		})
	},
	setAmmount: (id: number, amnt: number) => {
		set((state) => {
			const newItems = state.items.map((item) => {
				if (item.productId === id) item.amount = amnt > 0 ? amnt : 0
				return item
			})
			updateAccount(newItems)
			return { items: newItems }
		})
	},
})
