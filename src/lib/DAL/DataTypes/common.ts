import { Ref, mongoose } from '@typegoose/typegoose'

export const defaultId = () => new mongoose.Types.ObjectId()

export interface typeMap {
    number: number
    string: string
    boolean: boolean
    link: Ref<any>
    ObjectId: mongoose.Types.ObjectId
}

export type dataType<T extends ReadonlyArray<string>> = {
    [key in T extends ReadonlyArray<infer U> ? U : never]: field
}

interface validator {
    validator: (a: any) => boolean | Promise<boolean>
    msg: string
}

interface field {
    type: keyof typeMap
    default?: () => any
    validate?: validator[]
}
