"use client"
import ImageComponent from "@/components/ui/ImageComponent"
import Price from "@/components/product/Price"
import useCartStore from "@/store/cartStore"

type props = {
	id: number
	name: string
	brand: string
	price: number
	discount: number
	amount: number
	image: string
	logo: string
}

export default function CartRow(product: props) {
	const {
		setAmmount: setAmmountStore,
		discardItem: discardItemStore,
		items: storeItems,
	} = useCartStore((state) => state)

	const setAmmount = (amnt: number) => setAmmountStore(product.id!, amnt)
	const discardItem = () => discardItemStore(product.id!)
	const amount =
		storeItems.find((storeItem) => storeItem.productId === product.id)?.amount || 0
	if (!product.id || !amount) return <></>
	return (
		<div>
			<ImageComponent
				fallback="products/template.jpeg"
				alt=""
				width={30}
				height={30}
				src={"/products/" + product.image}
			/>
			<h3>{product.name}</h3>
			<Price price={product.price} discount={product.discount} className="" />
			<div>
				<button onClick={() => setAmmount(amount - 1)}>-</button>
				<span>{amount}</span>
				<button onClick={() => setAmmount(amount + 1)}>+</button>
				<button onClick={discardItem}>X</button>
			</div>
		</div>
	)
}
