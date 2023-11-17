'use client'
import useCartStore from '@/store/cartStore'
import styles from './index.module.scss'
import AmmountSelector from '../AmmountSelector'
import { Product } from '@/lib/DAL/Models'

export default function BuyButton(item: typeof Product) {
    const cachedItem = useCartStore((state) =>
        state.items.find((cacheItem) => cacheItem.product === item._id)
    )
    const addItem = useCartStore((state) => state.addItem)
    if (!cachedItem) {
        return (
            <div className={`${styles.ammountSelector} ${''}`}>
                <button
                    className={`${styles.button} ${styles.buy}`}
                    onClick={() => addItem(item)}
                >
                    Buy
                </button>
            </div>
        )
    } else {
        return <AmmountSelector {...cachedItem} />
    }
}
