/* eslint-disable no-unused-vars */

export const productRequiredFields = ['name'] as const
export const productSearchQueryFields = ['name'] as const
const productOptionalFields = ['description', 'link'] as const
const productContentFields = ['image'] as const

export type productSearchQuerysTypes = {
    [T in (typeof productRequiredFields)[number]]: string | undefined
}
export type productPathsTypes = {
    [T in (typeof productRequiredFields)[number]]: string
} & { [T in (typeof productOptionalFields)[number]]: string | undefined } & {
    [T in (typeof productContentFields)[number]]: string | undefined
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
