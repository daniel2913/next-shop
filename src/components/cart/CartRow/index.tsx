import { Item, Product } from '@/lib/DAL/MongoModels'
import styles from './index.module.scss'
import ImageComponent from '@/components/UI/ImageComponent'
import Price from '@/components/Product/Price'
import BuyButton from '@/components/UI/BuyButton'

export default function CartRow(item: { product: Product; amount: number }) {
    return (
        <div className={styles.cartRow}>
            <ImageComponent
                width={30}
                height={40}
                alt={item.product.name}
                fallback="api/public/products/template.jpeg"
                src={'api/public/products/' + item.product.images[0]}
            />
            <span>{item.product.name}</span>
            <span>{item.product.brand.name}</span>
            <Price
                className={styles.price}
                price={item.product.price * item.amount}
                discount={item.product.discount}
            />
            <BuyButton {...item.product} />
        </div>
    )
}
