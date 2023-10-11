import { StateCreator } from 'zustand'
import React from 'react'

export interface BaseModalSlice {
    base: {
        isVisible: boolean
        content: React.JSX.Element | null
        show: () => void
        close: () => void
        setModal: (newContent: React.JSX.Element) => void
    }
}

export const createBaseModalSlice: StateCreator<BaseModalSlice> = (set) => ({
    base: {
        isVisible: false,
        content: null,
        show: () =>
            set((state) => ({ base: { ...state.base, isVisible: true } })),
        close: () =>
            set((state) => ({ base: { ...state.base, isVisible: false } })),
        setModal: (newContent) =>
            set((state) => ({ base: { ...state.base, content: newContent } })),
    },
})
