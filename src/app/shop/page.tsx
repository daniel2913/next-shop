import ProductCard from '@/components/product/ProductCard'
import { Brand, BrandModel, ProductModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'
import styles from './page.module.scss'

export async function getProducts(id: string[]) {
    await dbConnect()
    const query = id.length ? { _id: id } : {}
    const products = await ProductModel.find(query).lean().exec()
    const brandIds: Set<string> = new Set()
    for (const product of products) {
        brandIds.add(product.brand.toString())
    }
    const brands = await BrandModel.find({ _id: Array.from(brandIds) })
        .lean()
        .exec()
    const brandList = brands.reduce(
        (
            prev: Partial<{
                [i in (typeof brands)[number]['_id']]: (typeof brands)[0]
            }>,
            cur
        ) => ({
            ...prev,
            [cur._id]: cur,
        }),
        {}
    )
    return { products, brandList }
}

export default async function Browse({
    params,
    searchParams,
}: {
    params: { link: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { products, brandList } = await getProducts([])

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.searchbar}>
                <label htmlFor="searchbar">Search for products</label>
                <input id="searchbar" placeholder="Search..." type="text" />
            </div>
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
