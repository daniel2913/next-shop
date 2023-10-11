import styles from './index.module.scss'

interface props {
    discount: number
    className: string
}

export default function Discount({ discount, className }: props) {
    const lvls = ['none', 'small', 'medium', 'high', 'insane']
    const style = lvls[(discount / 20) ^ 0]
    return (
        <div className={`${styles.discount} ${styles[style]} ${className}`}>
            <span className={`${styles.text}`}>
                {discount}%
            </span>
        </div>
    )
}
