import { StateCreator } from "zustand"

type Items = Record<number, number>
export interface CartSlice {
	items: Items
	addItem: (item: number, noUpd?: boolean) => void
	discardItem: (id: number, noUpd?: boolean) => void
	setAmmount: (id: number, amnt: number, noUpd?: boolean) => void
	setItems: (items: Items) => void
}

export const validCartItemProps = [
	"id",
	"name",
	"link",
	"ammount",
	"price",
] as const

function updateAccount(cart: Items) {
	fetch("/api/store", {
		method: "PATCH",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(cart),
	})
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
	items: {},
	addItem: (id: number, noUpd?: boolean) => {
		set((state) => {
			const newItems = { ...state.items }
			newItems[id] = 1
			if (!noUpd) updateAccount(newItems)
			return { items: { ...state.items, [id]: 1 } }
		})
	},
	setItems: (items: Items) => {
		set((_) => {
			updateAccount(items)
			return { items }
		})
	},
	discardItem: (id: number, noUpd?: boolean) => {
		set((state) => {
			const { [id]: _, ...items } = state.items
			if (!noUpd) updateAccount(items)
			return { items }
		})
	},
	setAmmount: (id: number, amnt: number, noUpd?: boolean) => {
		set((state) => {
			const { [id]: _, ...items } = state.items
			if (amnt > 0) items[id] = amnt
			if (!noUpd) updateAccount(items)
			return { items }
		})
	},
})
