import { create } from "zustand"
import { persist } from "zustand/middleware"
import { setCartAction } from "@/actions/cart"


type Items = Record<number, number>

interface CartState {
	items: Items
	addItem: (item: number, noUpd?: boolean) => void
	discardItem: (id: number, noUpd?: boolean) => void
	setAmmount: (id: number, amnt: number, noUpd?: boolean) => void
	setItems: (items: Items) => void
}

function deffer<T extends (args: any) => any>(func: T, delay: number = 5000) {
	let delayed = false
	let storedArgs: Parameters<T>
	return function deffered(...args: Parameters<T>) {
		storedArgs = args
		if (!delayed)
			setTimeout(() => {
				delayed = false
				func.apply(null, storedArgs)
			}, delay)
		delayed = true
	}
}

const updateAccount = deffer(setCartAction, 2000)

const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
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
			}
		}),{
			name: "cart-store",
			skipHydration: true,
			partialize: (state) => ({
				cart: state.items
			}),
		}
))

export default useCartStore
