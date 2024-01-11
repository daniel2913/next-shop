import { create } from "zustand"
import { CartSlice, createCartSlice } from "./cartSlice"
import { persist } from "zustand/middleware"
const useCartStore = create<CartSlice>()(
	persist(
		(...a) => ({
			...createCartSlice(...a),
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
