'use client'
import useCartStore from '@/store/cartStore'
import styles from './index.module.scss'
import AmmountSelector from '../AmmountSelector'

interface props{
	id:string
	name:string
	ammount:number
	price:number
	link:string
}

export default function AddToCart(item:props){
	
	const cachedItem = useCartStore(state=>state.items.filter(cacheItem=>cacheItem.id===item.id)[0])
	const addItem = useCartStore(state=>state.addItem)
	if (!cachedItem){
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
	}
	else{
		return <AmmountSelector {...{currentAmmount:1,id:item.id,} }/>
	}
}