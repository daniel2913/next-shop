import { ProductModel, UserModel } from "@/lib/DAL/Models"
import styles from "./page.module.scss"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getAllBrands } from "@/helpers/cachedGeters"
import ImageComponent from "@/components/ui/ImageComponent"
import Discount from "@/components/product/Discount"
import Price from "@/components/product/Price"
import AmmountSelector from "@/components/ui/AmmountSelector"
import useCartStore from "@/store/cartStore"
import CartRow from "@/components/cart/CartRow"

interface props {
	login: string
	avatar: string
	con: any
}

export default async function Cart({
	params,
	searchParams,
}: {
	params: { profile: string }
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.name) redirect("/api/auth/signin")
	getAllBrands()
	const user = await UserModel.findOne({ username: session.user.name })
	if (!user) throw "Fuck!"
	const cart = JSON.parse(user.cart!) as [{ amount: number; product: string }]
	const products = await ProductModel.find({
		_id: cart.map((item) => item.product),
	})
	const brands = await getAllBrands()
	const order = cart.map((item) => {
		const product = products.find((product) => product._id === item.product)
		if (!product) return null
		const brand = brands.find((brand) => brand.name === product.brand)
		if (!brand) return null
		return {
			_id: product._id,
			name: product.name,
			brand: brand.name,
			price: product.price,
			discount: product.discount,
			amount: item.amount,
			image: product.images[0],
			logo: brand.image,
		}
	})

	return (
		<div className={styles.pageWrapper}>
			<h2 className={styles.login}>{session.user.name}</h2>
			{order.map((item) => {
				if (!item)
					return (
						<div>
							<span>Error!</span>
						</div>
					)
				else return <CartRow {...item} />
			})}
		</div>
	)
}
