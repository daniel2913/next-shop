import { create } from 'zustand'
import { cartSlice, createCartSlice } from './cartSlice'
import { createJSONStorage, persist } from 'zustand/middleware'
import { linkedStorage } from './localStorage'

const useCartStore = create<cartSlice>()(
    persist(
        (...a) => ({
            ...createCartSlice(...a),
        }),
        {
            name: 'cart-store',
            skipHydration: true,
            storage: createJSONStorage(() => linkedStorage),
        }
    )
)

export default useCartStore
