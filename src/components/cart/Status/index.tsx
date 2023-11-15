'use client'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import useCartStore from '@/store/cartStore'
import useConfirm from '@/hooks/modals/useConfirm'

export default function CartStatus() {
    const items = useCartStore((state) => state.items)
    const setLocalCache = useCartStore((state) => state.setItems)
    const confirmOverwrite = useConfirm(
        'Do you want to use your local cart cache?'
    )
    useEffect(() => {
        if (!useCartStore.persist.hasHydrated())
            useCartStore.persist.rehydrate()
        async function getCache() {
            const remoteCache = await (await fetch('api/store')).json()
            const localCache = JSON.parse(
                localStorage.getItem('cart-store') || '[]'
            )?.state?.items
            // as Item[]
            if (remoteCache.length > 0) {
                if (!localCache?.length) {
                    setLocalCache(remoteCache)
                } else if (
                    JSON.stringify(remoteCache) != JSON.stringify(localCache)
                ) {
                    confirmOverwrite().then((ans) => {
                        if (!ans) {
                            setLocalCache(remoteCache)
                        }
                    })
                }
            }
        }
        getCache()
    }, [])

    return <div>{items.reduce((sum, i) => sum + i.amount, 0)}</div>
}
