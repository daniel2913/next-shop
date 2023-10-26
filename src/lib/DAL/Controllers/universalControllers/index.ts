import { DocumentType, ReturnModelType } from '@typegoose/typegoose'
import addController from './addController'
import deleteController from './deleteController'
import getController from './getController'
import patchController from './patchController'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import patchImages from './patchImages'
import { Query } from 'mongoose'
import { ProductModel } from '../../MongoModels'

export {
    addController,
    deleteController,
    getController,
    patchController,
    patchImages,
}

export type Tconfig<T extends AnyParamConstructor<any>> = {
    DIR_PATH: string
    model: ReturnModelType<T>
    multImages: boolean
}

export async function isValidDocument<T extends AnyParamConstructor<any>>(
    doc: unknown
) {
    if (
        !doc ||
        typeof doc != 'object' ||
        !('validate' in doc) ||
        typeof doc?.validate != 'function'
    )
        return false
    try {
        await doc.validate()
        return doc as DocumentType<T>
    } catch (error) {
        console.log(error)
        return false
    }
}

export function collectFromForm<T extends AnyParamConstructor<any>>(
    form: FormData,
    config: Tconfig<T>
) {
    const props: any = {}
    const imagesPath = config.multImages ? 'images' : 'image'
    console.log('form: ', form)
    for (const [key, value] of form.entries()) {
        if (
            !value ||
            (key === 'image' && key != imagesPath) ||
            (key === 'images' && key != imagesPath)
        )
            continue
        if (props[key]) {
            if (Array.isArray(props[key])) {
                props[key].push(value)
            } else {
                props[key] = [props[key], value]
            }
        } else {
            props[key] = value
        }
    }
    console.log('props: ', props)
    props[imagesPath] = formatImages<T>(props[imagesPath], config)
    return props
}

export function imagesDiff<T extends AnyParamConstructor<any>>(
    newImages: string[],
    config: Tconfig<T>,
    oldImages: string[] = [],
    deleteImages: string[] = []
) {
    if (!config.multImages) return [newImages[0]]
    if (!oldImages) return newImages
    return oldImages
        .filter((image, idx) => !deleteImages.includes(idx.toString()))
        .concat(newImages)
}

export function collectQueries<T extends AnyParamConstructor<any>>(
    params: URLSearchParams,
    config: Tconfig<T>
) {
    const query: Partial<{ [i: string]: string }> = {}
    for (const [key, value] of params.entries()) {
        if (value && key in config.model.schema.paths) {
            query[key] = value
        }
    }
    if ('name' in query) {
        query['name'] = new RegExp(query['name'] as string) as any as string
    }
    return query
}

export function formatImages<T extends AnyParamConstructor<any>>(
    propsImages: unknown,
    config: Tconfig<T>
) {
    if (!propsImages) return []
    if (!Array.isArray(propsImages)) return [propsImages]
    return config.multImages
        ? propsImages
        : propsImages[0]
        ? [propsImages[0]]
        : []
}

type FormValue = File | string

export type form = {
    [a: string]: FormValue | FormValue[]
} & (
    | {
          images: FormValue[]
          image: never
      }
    | {
          image: FormValue
          images: never
      }
)
