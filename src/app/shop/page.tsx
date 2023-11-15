import ProductList from '@/components/Products'
import { Suspense } from 'react'

export default function Shop({
    params,
    searchParams,
}: {
    params: { link: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <>
				<ProductList params={params} searchParams={searchParams} />
        </>
    )
}
