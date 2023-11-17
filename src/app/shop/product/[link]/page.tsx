import Carousel from '@/components/ui/Carousel'
import styles from './Details.module.scss'
import React from 'react'
import Rating from '@/components/ui/Rating'
import Image from 'next/image'
import AmmountSelector from '@/components/ui/AmmountSelector'
import Price from '@/components/product/Price'
import dbConnect from '@/lib/dbConnect'
import { BrandModel, ProductModel } from '@/lib/DAL/Models'
import Discount from '@/components/product/Discount'
import BuyButton from '@/components/ui/BuyButton'

export async function getProductByLink(adr: string) {
    ///CHANGGGGGGGGGGGGGGGGGE IT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    await dbConnect()
    const product = await ProductModel.findOne({ link: adr })
    if (!product) return false
    const brand = (await BrandModel.findOne({ name: product.brand }))|| { name: 'unknown', image: 'template.jpeg', link: './' }

    return { product, brand }
}

export default async function Details({
    params,
    searchParams,
}: {
    params: { link: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const route = params.link
    if (!route) throw 'no route'
    const res = await getProductByLink(Array.isArray(route) ? route[0] : route)
    if (!res) throw 'FOCK YOU' //get da guck away
    const { product, brand } = res
    const slides = product.images.map((img, i) => (
        <Image
            width={300}
            height={500}
            key={i}
            src={`/products/${img || 'template.jpeg'}`}
            alt="pic"
        />
    ))

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.productImage}>
                <Carousel>{slides}</Carousel>
                <Image
                    className={styles.brandImage}
                    width={30}
                    height={30}
                    alt="brand"
                    src={`/brands/${brand.image || 'template.jpeg'}`}
                />
                <Discount
                    discount={product.discount || 0}
                    className={styles.discountPos}
                />
            </div>
            <div className={styles.text}>
                <h3 className={styles.productName}>
                    {product.name}
                    <span className={styles.brandName}>{brand.name}</span>
                </h3>
                <span className={styles.productCategory}>
                    {product.category}
                </span>
                <Price
                    className={styles.productPrice}
                    price={product.price}
                    discount={product.discount || 0}
                />
                <BuyButton {...{...product, id:product._id.toString(), ammount:0}} />
                <p className={styles.productDescription}>
                    {product.description}
                </p>
                <div className={styles.productRating}>
                    <Rating rating={3}></Rating>
                </div>
            </div>
        </div>
    )
}
