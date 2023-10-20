'use server'
import styles from './index.module.scss'
import { getProducts } from '../page'
import CartRow from '@/components/Cart/CartRow'
import { Item, Product, UserModel } from '@/lib/DAL/MongoModels'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/dbConnect'

async function getCart() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
        return []
    }
    return JSON.parse(
        (await UserModel.findOne({ name: session.user.name }))?.cart || '[]'
    ) as Item[]
}

export default async function CartPage() {
    await dbConnect()
    const items = await getCart()
    const { products, brandList } = await getProducts(
        items.map((item) => item.product) as string[]
    )
    const rows = products.map((product) => ({
        product: {
            ...product,
            brand: brandList[product.brand as string],
        } as Product,
        amount: items.find((item) => item.product == product._id)?.amount || 0,
    }))
    return (
        <>
            <div className={styles.cartList}>
                {rows.map((row) => {
                    return <CartRow key={row.product._id} {...row} />
                })}
            </div>
        </>
    )
}
