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
