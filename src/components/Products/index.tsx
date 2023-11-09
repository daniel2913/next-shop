import ProductCard from '@/components/product/ProductCard'
import { Brand, BrandModel, Product, ProductModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'
import styles from './index.module.scss'
import {
    collectQueries,
    getController,
} from '@/lib/DAL/controllers/universalControllers'

type TSearchParams = { [key: string]: string | string[] | undefined }

export async function getProducts(searchParams: TSearchParams) {
    const query = collectQueries(searchParams, { model: ProductModel })
    const products = await await ProductModel.find(query).lean().exec()
    const brandList = await await BrandModel.find().lean().exec()
    return { products, brandList }
}

export default async function ProductList({
    params,
    searchParams,
}: {
    params: { link: string }
    searchParams: TSearchParams
}) {
    const { products, brandList } = await getProducts(searchParams)
    console.log(searchParams)
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.featured}>
                <div className={styles.featuredProducts}></div>
                <div className={styles.featuredBrands}></div>
            </div>
            <div className={styles.productGrid}>
                {products.map((product, i) => (
                    <ProductCard
                        key={i}
                        product={product}
                        brand={
                            brandList[product.brand.toString()] ||
                            ({
                                name: 'unknown',
                                image: 'template.jpeg',
                                link: './',
                            } as Brand)
                        }
                    />
                ))}
            </div>
        </div>
    )
}
