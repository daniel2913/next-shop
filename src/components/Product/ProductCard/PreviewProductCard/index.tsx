import Carousel from '../../../ui/Carousel'
import styles from '../index.module.scss'
import Price from '../../Price'
import Discount from '../../Discount'
import ImageComponent from '@/components/ui/ImageComponent'
import Link from 'next/link'
import BuyButton from '@/components/ui/BuyButton'

import type {
    Brand,
    BrandModel,
    Product,
} from '../../../../lib/DAL/MongoModels'
import { useEffect, useState } from 'react'
import { Require_id } from 'mongoose'

type props = {
    product: Product
}

export default function PreviewProductCard({ product }: props) {
    const [brand, setBrand] = useState({
        name: 'unknown',
        image: 'template.jpeg',
    })
    useEffect(() => {
        async function getBrand() {
            const brand = (
                await (await fetch('api/brand?name=' + product.brand)).json()
            )[0] as null | Brand
            if (!brand) return false
            else setBrand({ name: brand.name, image: brand.image })
        }
    }, [product.brand])
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
            <h3 className={styles.name}>{product.name}</h3>
            <span className={styles.brand}>{brand.name || 'unknown'}</span>
            <span className={styles.category}>{product.category}</span>
            <Price
                className={styles.price}
                price={product.price || 200}
                discount={product.discount || 0}
            />
            <p className={styles.description}>{product.description}</p>
        </div>
    )
}
