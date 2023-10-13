'use client'
import React from 'react'
import styles from './index.module.scss'
import useConfirm from '@/hooks/modals/useConfirm'
import useCartStore from '@/store/cartStore'
import { Item } from '@/lib/DAL/MongoModels'

export default function AmmountSelector(item: Item) {
    const confirm = useConfirm('Are you sure you want to discard this item?')
    const amount = useCartStore(
        (state) => state.items[0] //.filter((i) => i.product === item.product)
    ).amount
    const itemDiscarder = useCartStore((state) => state.discardItem)
    const ammountSetter = useCartStore((state) => state.setAmmount)
    const discardItem = () => itemDiscarder(item.product.toString())
    const setAmmount = (amnt: number) =>
        ammountSetter(item.product.toString(), amnt)
    function clickHandler(newAmount: number) {
        if (newAmount <= 0) {
            confirm().then((ans) => {
                return ans ? discardItem() : false
            })
        } else setAmmount(newAmount)
        console.log(newAmount)
    }
    return (
        <div className={''}>
            <div className={styles.ammountSelector}>
                <button
                    className={`${styles.button} ${styles.increase}`}
                    onClick={() => clickHandler(amount + 1)}
                >
                    +
                </button>
                <span className={styles.ammount}>{amount}</span>
                <button
                    className={`${styles.button} ${styles.decrease}`}
                    onClick={() => clickHandler(amount - 1)}
                >
                    -
                </button>
            </div>
        </div>
    )
}
