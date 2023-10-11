/* eslint-disable no-unused-vars */
import findProduct from './findProduct.ts'
import newProduct from './newProduct.ts'

export const productRequiredFields = [
    'name',
    'brand',
    'category',
    'price',
] as const
export const productSearchQueryFields = [
    'name',
    'brand',
    'category',
    'price',
] as const
const productOptionalFields = ['description', 'discount'] as const
const productContentFields = ['images'] as const

export type productSearchQuerysTypes = {
    [T in (typeof productRequiredFields)[number]]: string | undefined
}
export type productPathsTypes = {
    [T in (typeof productRequiredFields)[number]]: string
} & { [T in (typeof productOptionalFields)[number]]: string | undefined } & {
    [T in (typeof productContentFields)[number]]: string[] | undefined
}

export function validateProductRequiredFields(args: any) {
    const res: Partial<productPathsTypes> = {}
    productRequiredFields.forEach((i) => {
        if (!(i in args)) throw { statusCode: 400, message: 'Invalid request' }
        res[i] = args[i] + ''
    })
    productOptionalFields.forEach((i) => {
        if (i in args) res[i] = args[i] + ''
    })
    productContentFields.forEach((i) => {
        if (i in args && typeof args[i] == 'object')
            res[i] = args[i] as string[] //Fix it
    })
    return res as productPathsTypes
}

export function validateProductSearchQuerys(args: any) {
    const res: Partial<productSearchQuerysTypes> = {}
    productSearchQueryFields.forEach((i) => {
        if (!(i in args)) res[i] = ''
        else res[i] = args[i] + ''
    })
    return res as productSearchQuerysTypes
}

export { findProduct, newProduct }
