'use client'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import Price from '../Product/Price'
import Image from 'next/image'
import AmmountSelector from '../UI/AmmountSelector'
import { getCartCache } from '@/hooks/cart/useCartCache'
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

export default async function Cart() {
	const items = useCartStore(state=>state.items)
	const addItem = useCartStore(state=>state.addItem)
	useEffect(()=>{
		async function loadCache(){
			const cache = await getCartCache()
			for (const i of cache){
				addItem(i)
			}
		}
		loadCache()
		console.log(items)
	},[items])
    return (
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
