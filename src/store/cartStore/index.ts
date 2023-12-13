import { create } from "zustand"
import { CartSlice, createCartSlice } from "./cartSlice"
import { persist } from "zustand/middleware"
import { VotesSlice, createVotesSlice } from "./votesSlice"
const useCartStore = create<CartSlice&VotesSlice>()(
	persist(
		(...a) => ({
			...createCartSlice(...a),
			...createVotesSlice(...a),
		}),
		{
			name: "cart-store",
			skipHydration: true,
			partialize:(state)=>({
			    cart:state.items
			}),
		}
	)
)

export default useCartStore
