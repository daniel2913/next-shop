import { create } from "zustand"
import { BaseModalSlice, createBaseModalSlice } from "./baseSlice"


const useModalStore = create<
	BaseModalSlice
>()((...a) => ({
	...createBaseModalSlice(...a),
}))

const useToastStore = create<
	BaseModalSlice
>()((...a) => ({
	...createBaseModalSlice(...a),
}))

export {useModalStore, useToastStore}
