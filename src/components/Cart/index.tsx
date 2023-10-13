'use client'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import Price from '../Product/Price'
import Image from 'next/image'
import AmmountSelector from '../UI/AmmountSelector'
import useCartStore from '@/store/cartStore'
import BuyButton from '../UI/BuyButton'
import { Item } from '@/lib/DAL/MongoModels'

export default function Cart() {
    const items = useCartStore((state) => state.items)
    const setLocalCache = useCartStore((state) => state.setItems)
    useEffect(() => {
        if (!useCartStore.persist.hasHydrated())
            useCartStore.persist.rehydrate()
        async function getCache() {
            const remoteCache = JSON.parse(
                await (await fetch('api/store')).json()
            ) as Item[]
            console.log(remoteCache)
            if (remoteCache.length > 0) {
                if (items.length < 1) {
                    setLocalCache(remoteCache)
                }
                if (JSON.stringify(remoteCache) != JSON.stringify(items)) {
                    setLocalCache(remoteCache)
                    console.log('MERGING!!!')
                }
            }
        }
        getCache()
    }, [])

    return (
        <h1>test</h1> || (
            <div className={styles.cartContainer}>
                <div className={styles.cartHeader}></div>
                {items.map((item) => {
                    return (
                        <div
                            key={item.product.toString()}
                            className={styles.cartItem}
                        >
                            {/* <Image
                            src={item.images[0]}
                            alt={item.name}
                            height={50}
                            width={30}
                        /> */}
                            <h3 className={styles.cartItemName}></h3>
                            <p className={styles.cartItemBrand}></p>
                        </div>
                    )
                })}
                <div className={styles.CartFooter}></div>
            </div>
        )
    )
}
