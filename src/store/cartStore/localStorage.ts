import { StateStorage } from 'zustand/middleware'

let skipInitial = 1
export const linkedStorage: StateStorage = {
    getItem: (name: string): string | null => {
        return localStorage.getItem(name)
    },

    setItem: (name: string, value: string) => {
        localStorage.setItem(name, value)
        if (skipInitial) {
            fetch('api/store', {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: localStorage.getItem(name),
            })
        } else {
            skipInitial++
        }
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name)
    },
}
