import ProductList from "@/components/Products";

export default function Shop({
    params,
    searchParams,
}: {
    params: { link: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return (
        <div className="">
            <ProductList params={params} searchParams={searchParams} />
        </div>
    );
}
