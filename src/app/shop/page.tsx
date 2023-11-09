import ProductList from '@/components/Products'
import Search from '@/components/ui/Search'

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
