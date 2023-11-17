import ProductCard from '@/components/product/ProductCard'
import { Brand, BrandModel, ProductModel } from '@/lib/DAL/Models'
import styles from './index.module.scss'
import {
	Tconfig,
    collectQueries,
    getController,
} from '@/lib/DAL/controllers/universalControllers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllBrands } from '@/helpers/cachedGeters'
import dbConnect from '@/lib/dbConnect'

type TSearchParams = { [key: string]: string | string[] | undefined }

export async function getProducts(searchParams: TSearchParams) {
	await dbConnect()
    const query = collectQueries(searchParams, { model: ProductModel } as any as Tconfig<typeof ProductModel>) ////FIX!!!
    const products = await ProductModel.find(query)
    const brandList = await getAllBrands()
    return { products, brandList }
}

export default async function ProductList({
    params,
    searchParams,
}: {
    params: { link: string }
    searchParams: TSearchParams
}) {
	const role:'admin' | 'user' = (await getServerSession(authOptions))?.user?.role || 'user'
    const { products, brandList } = await getProducts(searchParams)
	console.log(products)
	console.log(brandList)
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
						role={role}
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
