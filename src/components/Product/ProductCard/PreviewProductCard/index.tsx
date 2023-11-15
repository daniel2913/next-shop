import Carousel from '../../../ui/Carousel'
import styles from './index.module.scss'
import Price from '../../Price'
import Discount from '../../Discount'
import ImageComponent from '@/components/ui/ImageComponent'

import type { Brand, Product } from '../../../../lib/DAL/MongoModels'
import { useEffect, useState } from 'react'
import React from 'react'
import Image from 'next/image'
import { imageOptimizer } from 'next/dist/server/image-optimizer'

type props = {
    product: Omit<Product,'images'|'link'>&{
		images:File[] | null
		brandImage: string
	}
}



export default function PreviewProductCard({ product }: props) {
	const currentImageUrls = React.useRef<string[]>([])
	currentImageUrls.current = React.useMemo(()=>{
		for (const image of currentImageUrls.current) {
			URL.revokeObjectURL(image)
		}
		currentImageUrls.current = []
		let res: string[] = []
		if (!product.images) return res
		for (const image of product.images) {
			res.push(URL.createObjectURL(image))
		}
		currentImageUrls.current.push(...res)
		return res
	}
	,[product.images])
    return (
        <div className={styles.productCard}>
            <div className={styles.image}>
                <Carousel>
                    {currentImageUrls.current.length>0 
					?currentImageUrls.current.map((img, i) => (
                        <img
                            width={230}
                            height={230}
                            key={img}
                            src={img}
                            alt={product.name}
                        />
                    ))
					:[<img
					width={230}
					key='template'
					height={230}
					src='/api/public/products/template.jpeg'
					alt={product.name}
				/>]
				}
                </Carousel>
                <img
                    className={styles.brandImage}
                    height={30}
                    width={30}
                    alt={`/api/public/brands/${product.brandImage}` || 'unknown'}
                    src={`/api/public/brands/${product.brandImage}`}
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
