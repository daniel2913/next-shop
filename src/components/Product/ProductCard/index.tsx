import Carousel from '../../ui/Carousel'
import styles from './index.module.scss'
import Price from '../Price'
import Discount from '../Discount'
import ImageComponent from '@/components/ui/ImageComponent'
import Link from 'next/link'
import BuyButton from '@/components/ui/BuyButton'

import type { Brand, Product } from '../../../lib/DAL/MongoModels'

type props = {
    product: Product
    brand: Brand
}

export default function ProductCard({ product, brand }: props) {
    return (
        <div className={styles.productCard}>
            <div className={styles.image}>
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
                    alt={brand.name || 'unknown'}
                    src={`/brands/${brand.image}`}
                    fallback="/brands/template.jpeg"
                />
                <Discount
                    discount={product.discount || 0}
                    className={styles.discount}
                />
            </div>
            <Link href={`./Product/${product.link}`}>
                <h3 className={styles.name}>{product.name}</h3>
            </Link>
            <span className={styles.brand}>{brand.name || 'unknown'}</span>
            <span className={styles.category}>{product.category}</span>
            <Price
                className={styles.price}
                price={product.price || 200}
                discount={product.discount || 0}
            />
            <BuyButton {...product} />
            <p className={styles.description}>{product.description}</p>
        </div>
    )
}
