import {
    BrandModel,
    CategoryModel,
} from "@/lib/DAL/Models";


export function cache<T extends (...args: any) => any>(func: T) {
    let cache: ReturnType<T>;
    async function revalidate(...args: Parameters<T>) {
        cache = await func(args);
    }
    async function get(...args: Parameters<T>) {
        if (cache) {
            return cache;
        }
        cache = await func(args);
        return cache;
    }
    return [get, revalidate];
}

export const [getAllBrands, revalidateBrands] = cache(() => BrandModel.find());
export const [getAllCategories, revalidateCategories] = cache(() => CategoryModel.find(),);
