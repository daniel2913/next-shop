import { ProductModel } from '@/lib/DAL/MongoModels'
import { cartItem, validCartItemProps } from '../../store/cartStore/cartSlice';
import useCartStore from '@/store/cartStore';
import { useEffect } from 'react';

function isCartItem(objs:Object[]):objs is cartItem[]{
	for (const obj of objs){
		for (const prop of validCartItemProps){
			if (!(prop in obj)){
				console.log(prop,obj)
				return false
			}
		}
	}
	return true
}

async function validateCart(cart:cartItem[]){
	const validCart: cartItem[] = []
	// for (const item of cart){
	// 	const valid = await ProductModel.findById({'_id':item.id})
	// 	if (valid){
	// 		validCart.push(
	// 			{
	// 				id:valid._id.toString(),
	// 				name:valid.name,
	// 				link:valid.link,
	// 				ammount:item.ammount > 0 ? item.ammount : 0,
	// 				price:valid.price
	// 			}
	// 		)
	// 	}
	// }
	return cart
}

export async function getCartCache() {
    const oldCartCache = window.localStorage.getItem('cart')
	if (oldCartCache){
		const oldCart = JSON.parse(oldCartCache)
		
		if (isCartItem(oldCart)){
			return await validateCart(oldCart)
		}
	}
    return [] as cartItem[]
}

export function updateCartCache(newCart:cartItem[]){
	window.localStorage.setItem('cart',JSON.stringify(newCart))
}
