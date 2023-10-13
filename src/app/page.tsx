import ProductCard from '@/components/Product/ProductCard'
import { Brand, BrandModel, ProductModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'
import styles from './page.module.scss'
import { productSearchQueryFields } from '@/lib/DAL/Controllers/brandController'
import { Ref } from '@typegoose/typegoose'

export async function getProducts() {
    await dbConnect()
    const products = await ProductModel.find().lean().exec()
    const brandIds: Set<string> = new Set()
    for (const product of products) {
        brandIds.add(product.brand.toString())
    }
    const brands = await BrandModel.find({ _id: Array.from(brandIds) })
        .lean()
        .exec()
    const brandList = brands.reduce(
        (prev: any, cur) => ({ ...prev, [cur._id]: cur }),
        {}
    ) as { [i: string]: Ref<Brand> }
    return { products, brandList }
}

export default async function Browse({
    params,
    searchParams,
}: {
    params: { link: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { products, brandList } = await getProducts()

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
                        {...{
                            ...product,
                            brand: brandList[product.brand.toString()],
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
