import { StateCreator } from "zustand"
import { addSaved, deleteSaved, getSaved } from "@/actions/savedProducts"
export interface SavedSlice {
	saved: number[]
	toggleSaved: (id: number) => void
	reloadSaved: (ids: number[]) => void
	clearSaved: () => void
}

export const createSavedSlice: StateCreator<SavedSlice> = (set, get) => ({
	saved: [],
	toggleSaved: async (id: number) => {
		const oldSaved = get().saved
		let newSaved:number[] = []
		let action: null | ((id: number) => Promise<boolean>) = null
		if (oldSaved.includes(id)) {
			action = deleteSaved
			newSaved = oldSaved.filter(num=>num!==id)
		}
		else {
			action = addSaved
			newSaved = [...oldSaved,id]
		}
		const res = action(id)
		set({ saved: newSaved})
		if (! (await res)) set({saved:oldSaved})
	},
	clearSaved: () => set({saved:[]}),
	reloadSaved: async (ids: number[]) => {
		const saved = await getSaved()
		set({saved})
	},

})
