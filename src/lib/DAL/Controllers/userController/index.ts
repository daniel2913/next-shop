/* eslint-disable no-unused-vars */
import createNewUser from './createNewUser.ts'
import changeUserRole from './changeUserRole.ts'

const userRequiredFields = ['name', 'passwordHash'] as const
const userSearchQuerys = ['name', 'role'] as const
const userOptionalFields = ['role', 'image'] as const

export type userSearchQuerysTypes = { name: string; role: string }
export type userPathsTypes = {
    [T in (typeof userRequiredFields)[number]]: string
} & { [T in (typeof userOptionalFields)[number]]: string | undefined }

export function validateUserRequiredFields(args: any) {
    const res: Partial<userPathsTypes> = {}
    userRequiredFields.forEach((i) => {
        if (!(i in args)) throw { statusCode: 400, message: 'Invalid request' }
        res[i] = args[i] + ''
    })
    userOptionalFields.forEach((i) => {
        if (i in args) res[i] = args[i] + ''
    })
    return res as userPathsTypes
}

export function validateRequiredFields(args: any) {
    const res: Partial<userPathsTypes> = {}
    userRequiredFields.forEach((i) => {
        if (!(i in args)) throw { statusCode: 400, message: 'Invalid request' }
        res[i] = args[i] + ''
    })
    userOptionalFields.forEach((i) => {
        if (i in args) res[i] = args[i] + ''
    })
    return res as userPathsTypes
}

export function validateUserSearchQuerys(args: any) {
    const res: Partial<userSearchQuerysTypes> = {}
    userSearchQuerys.forEach((i) => {
        if (!(i in args)) res[i] = ''
        else res[i] = args[i] + ''
    })
    return res as userSearchQuerysTypes
}

export { createNewUser, changeUserRole }
