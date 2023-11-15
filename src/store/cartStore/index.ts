import { create } from 'zustand'
import { cartSlice, createCartSlice } from './cartSlice'
import {  persist } from 'zustand/middleware'

const useCartStore = create<cartSlice>()(
    persist(
        (...a) => ({
            ...createCartSlice(...a),
        }),
        {
            name: 'cart-store',
            skipHydration: true,
        }
    )
)

export default useCartStore
