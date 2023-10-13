'use client'
import useCartStore from '@/store/cartStore'
import styles from './index.module.scss'
import AmmountSelector from '../AmmountSelector'
import { Product } from '@/lib/DAL/MongoModels'

export default function BuyButton(item: Product) {
    console.log(useCartStore((state) => state.items))
    const cachedItem = useCartStore(
        (state) => state.items[0] || null //filter((cacheItem) => cacheItem.product === item._id)[0]
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
