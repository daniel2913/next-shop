import {create} from "zustand"
import { ProductsSlice, createProductsSlice } from "./productsSlice"

const useProductStore = create<ProductsSlice>()((...a) => ({
	...createProductsSlice(...a),
}))
export default useProductStore
