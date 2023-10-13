import Carousel from '../../UI/Carousel'
import styles from './index.module.scss'
import Price from '../Price'
import Discount from '../Discount'
import ImageComponent from '@/components/UI/ImageComponent'
import Link from 'next/link'
import { Product } from '../../../lib/DAL/MongoModels'
import BuyButton from '@/components/UI/BuyButton'

export default function ProductCard(product: Product) {
    return (
        <div className={styles.productCard}>
            <div className={styles.productImage}>
                <Carousel>
                    {product.images.map((img, i) => (
                        <ImageComponent
                            width={230}
                            height={230}
                            key={i}
                            src={`/products/${img}`}
                            fallback="/products/template.jpeg"
                            alt={product.name}
                        />
                    ))}
                </Carousel>
                <ImageComponent
                    className={styles.brandImage}
                    height={30}
                    width={30}
                    alt={product.brand?.name || 'unknown'}
                    src={`/brands/${product.brand?.image}`}
                    fallback="/brands/template.jpeg"
                />
                <Discount
                    discount={product.discount || 0}
                    className={styles.productDiscount}
                />
            </div>
            <Link href={`./Product/${product.link}`}>
                <h3 className={styles.productTitle}>{product.name}</h3>
            </Link>
            <span className={styles.brand}>
                {product.brand?.name || 'unknown'}
            </span>
            <span className={styles.productCategory}>{product.category}</span>
            <Price
                className={styles.productPrice}
                price={product.price || 200}
                discount={product.discount || 0}
            />
            <BuyButton {...product} />
            <p className={styles.productDescription}>{product.description}</p>
        </div>
    )
}
