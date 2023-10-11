/* eslint-disable no-unused-vars */
import { types } from '@typegoose/typegoose'
import { AnyParamConstructor, Ref } from '@typegoose/typegoose/lib/types.ts'
import mongoose, { Error as mongoError } from 'mongoose'
import { User } from './MongoModels'

export function isMongoError(
    error: unknown
): error is mongoError.ValidationError {
    if (error instanceof mongoError.ValidationError) return true
    return false
}

type noMethods<T extends AnyParamConstructor<any>> = {
    [key in keyof InstanceType<T> as InstanceType<T>[key] extends Function
        ? never
        : key]: InstanceType<T>[key]
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

type stringRefs<T> = {
    [key in keyof T]: T[key] extends Ref<any> ? T[key] : string
}

type test = stringRefs<User>

export function newDocument<T extends AnyParamConstructor<any>>(
    cl: T,
    doc: noMethods<T>
) {
    const model = mongoose.models[cl.name]!
    const res = new model(doc)
    return res as types.DocumentType<InstanceType<T>>
}

//const test = newDocument(User,{login:'123',passwordHash:'test'})

// const test1 = await UserModel.find().findByLogin('test').exec()
// test1[0]
