import mongoose, { Error as mongoError } from 'mongoose'
import { User } from './Models'

export function isMongoError(
    error: unknown
): error is mongoError.ValidationError {
    if (error instanceof mongoError.ValidationError) return true
    return false
}


export type noFunc<T> = {
    [key in keyof T as T[key] extends Function ? never : key]: T[key]
}

type OF1<T> = { [key in keyof T as T[key] extends {} ? never : key]: T[key] }
type OF2<T> = { [key in keyof T as T[key] extends null ? never : key]: T[key] }

export type optFields<T> = noFunc<OF2<OF1<T>>>
export type reqFields<T> = noFunc<{
    [key in keyof T as T[key] extends {} ? key : never]: T[key]
}>


//const test = newDocument(User,{login:'123',passwordHash:'test'})

// const test1 = await UserModel.find().findByLogin('test').exec()
// test1[0]
