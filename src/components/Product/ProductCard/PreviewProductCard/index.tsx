import Carousel from '../../../ui/Carousel'
import styles from '../index.module.scss'
import Price from '../../Price'
import Discount from '../../Discount'
import ImageComponent from '@/components/ui/ImageComponent'

import type { Brand, Product } from '../../../../lib/DAL/MongoModels'
import { useEffect, useState } from 'react'
import React from 'react'

type props = {
    product: Product
}

const currentImageUrls: string[] = []

function previewImages(images: File[]) {
    for (const image of currentImageUrls) {
        URL.revokeObjectURL(image)
    }
    let res: string[] = []
    if (!images) res = []
    if (images instanceof File) res = [URL.createObjectURL(images)]
    for (const idx in images) {
        res.push(URL.createObjectURL(images[idx]))
    }
    currentImageUrls.push(...res)
    return res
}

export default function PreviewProductCard({ product }: props) {
    return (
        <div className={styles.productCard}>
            <div className={styles.image}>
                <Carousel>
                    {product.images?.map((img, i) => (
                        <ImageComponent
                            width={230}
                            height={230}
                            key={i}
                            src={`/products/${img}`}
                            fallback="/products/template.jpeg"
                            alt={product.name}
                        />
                    )) || <></>}
                </Carousel>
                <ImageComponent
                    className={styles.brandImage}
                    height={30}
                    width={30}
                    alt={product.brand || 'unknown'}
                    src={`/brands/${'template.jpeg'}`}
                    fallback="/brands/template.jpeg"
                />
                <Discount
                    discount={product.discount || 0}
                    className={styles.discount}
                />
            </div>
            <h3 className={styles.name}>{product.name}</h3>
            <span className={styles.brand}>{product.brand || 'unknown'}</span>
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
