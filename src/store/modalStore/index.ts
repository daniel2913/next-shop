import { create } from 'zustand'
import { BaseModalSlice, createBaseModalSlice } from './baseSlice'
import { ModalConfirmSlice, createModalConfirmSlice } from './confirmSlice'

const useModalStore = create<BaseModalSlice & ModalConfirmSlice>()((...a) => ({
    ...createBaseModalSlice(...a),
    ...createModalConfirmSlice(...a),
}))

export default useModalStore
