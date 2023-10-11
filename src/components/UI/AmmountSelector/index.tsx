'use client'
import React from 'react'
import styles from './index.module.scss'
import useConfirm from '@/hooks/modals/useConfirm'
import useCartStore from '@/store/cartStore'

interface props {
    currentAmmount?: number
    className?: string
	id:string
}

export default function AmmountSelector({
    currentAmmount = 1,
    className = '',
	id
}: props) {
    const confirm = useConfirm('Are you sure you want to discard this item?')
	const ammount = useCartStore(state=>state.items.filter(item=>item.id===id)[0]?.ammount)
	const itemDiscarder = useCartStore(state=>state.discardItem)
	const ammountSetter = useCartStore(state=>state.setAmmount)
	const discardItem = ()=>itemDiscarder(id)
	const setAmmount = (amnt:number) => ammountSetter(id,amnt)
    function clickHandler(inc: number) {
		console.log(ammount,inc)
        const newAmmount = ammount + inc
        if (newAmmount <= 0) {
			console.log('problemo')
            if (newAmmount < 0) return false
            confirm().then((ans) => {
                return ans ? discardItem() : false
            })
        } else setAmmount(ammount + inc)
		console.log(ammount)
    }
    return (
        <div className={className}>
            <div className={styles.ammountSelector}>
                <button
                    className={`${styles.button} ${styles.increase}`}
                    onClick={() => clickHandler(1)}
                >
                    +
                </button>
                <span className={styles.ammount}>{ammount}</span>
                <button
                    className={`${styles.button} ${styles.decrease}`}
                    onClick={() => clickHandler(-1)}
                >
                    -
                </button>
            </div>
        </div>
    )
}
