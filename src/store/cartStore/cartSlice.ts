import { useSession } from "next-auth/react"
import { StateCreator } from "zustand"

interface Item
{productId:number, amount:number}
export interface CartSlice {
	items: Item[]
	addItem: (item: number,noUpd?:boolean) => void
	discardItem: (id: number,noUpd?:boolean) => void
	setAmmount: (id: number, amnt: number,noUpd?:boolean) => void
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
	addItem: (id: number,noUpd?:boolean) => {
		set((state) => {
			const newItems = [...state.items]
			newItems.push({ amount: 1, productId: id })
			if (!noUpd)
			updateAccount(newItems)
			return { items: newItems }
		})
	},
	setItems: (items: Item[]) => {
		set((state) => {
			return { items }
		})
	},
	discardItem: (id: number, noUpd?:boolean) => {
		set((state) => {
			const newItems = state.items.filter((item) => item.productId !== id)
			if(!noUpd)
			updateAccount(newItems)
			return { items: newItems }
		})
	},
	setAmmount: (id: number, amnt: number, noUpd?:boolean) => {
		set((state) => {
			const newItems = state.items.map((item) => {
				if (item.productId === id) item.amount = amnt > 0 ? amnt : 0
				return item
			})
			if (!noUpd)
				updateAccount(newItems)
			return { items: newItems }
		})
	},
})
