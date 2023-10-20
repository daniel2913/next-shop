'use client'
import useCartStore from '@/store/cartStore'
import styles from './index.module.scss'
import AmmountSelector from '../AmmountSelector'
import { Product } from '@/lib/DAL/MongoModels'

export default function BuyButton(item: Product) {
    console.log(
        'B====3',
        useCartStore((state) => state.items)
    )
    // eslint-disable-next-line no-debugger
    const cachedItem = useCartStore(
        (state) =>
            state.items.filter((cacheItem) => cacheItem.product === item._id)[0]
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
