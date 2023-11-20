import {
    BrandModel,
    CategoryModel,
    Product,
    ProductModel,
} from "@/lib/DAL/Models";

function cache<T extends (...args: any) => any>(func: T) {
    let cache: ReturnType<T>;
    async function revalidate(args: Parameters<T>) {
        cache = func(args);
    }
    async function get(args: Parameters<T>) {
        if (cache) {
            console.log("Cached!");
            return cache;
        }
        console.log("No Cache!: ", cache);
        cache = func(args);
        return cache;
    }
    return [get, revalidate];
}

export const [getAllBrands, revalidateBrands] = cache(() => BrandModel.find());
export const [getAllCategories, revalidateCategories] = cache(() =>
    CategoryModel.find(),
);
