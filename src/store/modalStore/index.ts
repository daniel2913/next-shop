import { create } from "zustand"
import { BaseModalSlice, createBaseModalSlice } from "./baseSlice"
import { ModalConfirmSlice, createModalConfirmSlice } from "./confirmSlice"
import { ModalFormSlice, createModalFormSlice } from "./formSlice"

const useModalStore = create<
	BaseModalSlice & ModalConfirmSlice & ModalFormSlice
>()((...a) => ({
	...createBaseModalSlice(...a),
	...createModalConfirmSlice(...a),
	...createModalFormSlice(...a),
}))

export default useModalStore
