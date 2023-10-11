import styles from './index.module.scss'

interface props {
    price: number
    discount: number
    className: string
}

export default function Price({ price, discount = 0, className = '' }: props) {
    return discount > 0 ? (
        <div className={styles.productPrice + ' ' + className}>
            <s className={styles.oldPrice}>{price}</s>
            <span className={styles.newPrice}>
                {price - (price * discount) / 100}
            </span>
        </div>
    ) : (
        <div className={styles.productPrice}>{price}</div>
    )
}
