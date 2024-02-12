import { create } from "zustand"
import { persist } from "zustand/middleware"
import { setCartAction } from "@/actions/cart"


type Items = Record<string, number>

interface CartState {
	items: Items
	synced: number
	addItem: (item: number, noUpd?: boolean) => void
	discardItem: (id: number, noUpd?: boolean) => void
	setAmmount: (id: number, amnt: number, noUpd?: boolean) => void
	setItemsAndUpdate: (items: Items) => void
}

function deffer<T extends (args: any) => any>(func: T, delay: number = 5000) {
	let delayed = false
	let storedArgs: Parameters<T>
	let result: Promise<ReturnType<T>>
	return function deffered(...args: Parameters<T>) {
		storedArgs = args
		if (!delayed) {
			let resolve: (val: ReturnType<T>) => void
			result = new Promise(res => { resolve = res })
			setTimeout(() => {
				delayed = false
				return func.apply(null, storedArgs)
			}, delay)
			return result
		}
		delayed = true
		return result
	}
}

const updateAccount = setCartAction

const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			synced: -1,
			items: {},
			addItem: (id: number) => {
				const items = structuredClone(get().items)
				items[id] = 1
				updateAccount(items)
				set({items})
			},
			setItemsAndUpdate: (items: Items) => {
				updateAccount(items)
				set({ items })
			},
			discardItem: (id: number) => {
				const {[id]:_,...items} = get().items
				updateAccount(items)
				set({items})
			},
			setAmmount: (id: number, amnt: number) => {
				let items:Items = {}
				if (amnt > 0)
					items = {...get().items,[id]:amnt}
				else{
					const {[id]:_,..._items} = get().items
					items = _items
				}
				set({items})
				updateAccount(items)
			},
		}), {
		name: "cart-store",
		partialize: state => ({ items: state.items }),
		skipHydration: true,
	}
	))

export default useCartStore
