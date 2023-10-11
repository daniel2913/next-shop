import ProductCard, { ProductCardI } from '@/components/Product/ProductCard'
import { ProductModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'
import styles from './page.module.scss'

export async function getProducts() {
    await dbConnect()
    const products = (await ProductModel.find()
        .populate({ path: 'brand' })
        .lean()
        .exec()) as ProductCardI[]

    return products
}

export default async function Browse({
    params,
    searchParams,
}: {
    params: { link: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const products = await getProducts()

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.featured}>
                <div className={styles.featuredProducts}></div>
                <div className={styles.featuredBrands}></div>
            </div>
            <div className={styles.productGrid}>
                {products.map((product, i) => (
                    <ProductCard key={i} {...product} />
                ))}
            </div>
        </div>
    )
}
