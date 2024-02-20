import { create } from "zustand"
import { persist } from "zustand/middleware"
import { setCartAction } from "@/actions/cart"
import { deffer } from "@/helpers/misc"
import React from "react"
import { updateVoteAction } from "@/actions/vote"
import { toggleSavedAction } from "@/actions/savedProducts"
import { ServerErrorType } from "@/hooks/useAction"


type Items = Record<string, number>

interface CartState {
	items: Items
	saved:number[]
	votes:Record<string,number>
	synced: number
	addItem: (item: number, noUpd?: boolean) => void
	discardItem: (id: number, noUpd?: boolean) => void
	setAmmount: (id: number, amnt: number, noUpd?: boolean) => void
	setItemsAndUpdate: (items: Items) => void
	update: () => void
	toggleSaved:(id:number)=>Promise<boolean|ServerErrorType>
	setVote: (id:number,vote:number)=>Promise<{rating:number,voters:number}|ServerErrorType>
}

const updateAccount = deffer(setCartAction, 2000)

const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			synced: -1,
			items: {},
			saved:[],
			votes:{},
			
			toggleSaved:async (id:number)=>{
				const old = get().saved
				if (get().saved.includes(id))
					set({saved:old.filter(old=>old!==id)})
				else
					set({saved:[...old,id]})
				const res=await toggleSavedAction(id)
				if (typeof res === "object") set({saved:old})
				return res
			},
			setVote: async (id:number,value:number)=>{
				const votes = get().votes
				if (!(id in votes)) return {error:"You can only rate products you bought",title:"Not Allowed"}
				set({votes:{...votes,[id]:value}})
				const res = await updateVoteAction(id,value)
				if (!res) return {error:"Something Wrong", title:"Unknown Error"}
				if ("error" in res) set({votes})
				return res
			},
			addItem: (id: number) => {
				const items = structuredClone(get().items)
				items[id] = 1
				set({ items })
				updateAccount(false, items)
			},
			setItemsAndUpdate: (items: Items) => {
				updateAccount(false, items)
				set({ items })
			},
			update: () => updateAccount(true, get().items),
			discardItem: (id: number) => {
				const { [id]: _, ...items } = get().items
				set({ items })
				updateAccount(false, items)
			},
			setAmmount: (id: number, amnt: number) => {
				let items: Items = {}
				if (amnt > 0)
					items = { ...get().items, [id]: amnt }
				else {
					const { [id]: _, ..._items } = get().items
					items = _items
				}
				set({ items })
				updateAccount(false, items)
			},
		}), {
		name: "cart-store",
		partialize: state => ({ items: state.items }),
		skipHydration: true,
	}
	))

export default useCartStore
