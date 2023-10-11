import { dataType, typeMap } from '../DataTypes/common'

export type Schema<U extends ReadonlyArray<string>, T extends dataType<U>> =
{
    readonly [key in keyof T]: typeMap[T[key]['type']]
}