import { create } from 'zustand'
import { cartItem, cartSlice, createCartSlice } from './cartSlice'

const useCartStore = create<cartSlice>()((...a) => ({
    ...createCartSlice(...a),
}))

export default useCartStore
