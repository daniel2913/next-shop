import { cartItem, validCartItemProps } from '../../store/cartStore/cartSlice';


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
