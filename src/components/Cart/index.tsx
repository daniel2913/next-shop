'use client'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import Price from '../Product/Price'
import Image from 'next/image'
import AmmountSelector from '../UI/AmmountSelector'
import useCartStore from '@/store/cartStore'
import AddToCart from '../UI/AddToCart'

interface Item {
    name: string
    ammount: number
    brand: string
    price: number
    discount: number
    description: string
    id: any
    images: string[]
}

interface props {
    items: Item[]
}

export default function Cart() {
	const items = useCartStore(state=>state.items)
	useEffect(()=>{
		console.log(useCartStore)
		if (!useCartStore.persist.hasHydrated()) useCartStore.persist.rehydrate()
	},[])
    return <h1>test</h1> || (
        <div className={styles.cartContainer}>
            <div className={styles.cartHeader}></div>
            {items.map((item) => {
                return (
                    <div key={item.id} className={styles.cartItem}>
                        {/* <Image
                            src={item.images[0]}
                            alt={item.name}
                            height={50}
                            width={30}
                        /> */}
                        <h3 className={styles.cartItemName}></h3>
                        <p className={styles.cartItemBrand}></p>
                        <Price
                            className={styles.cartItemPrice}
                            price={item.price * item.ammount}
                            discount={0}
                        />
                        <AddToCart
                          //  className={styles.cartItemAmmount}
                            {...item}
                        />
                    </div>
                )
            })}
            <div className={styles.CartFooter}></div>
        </div>
    )
}
