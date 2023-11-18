import addController from './addController'
import deleteController from './deleteController'
import getController from './getController'
import patchController from './patchController'
import patchImages from './patchImages'
import { DataModels } from '../../Models/base'

export {
    addController, ////TODO!!!!
    deleteController,
    getController,
    patchController,
    patchImages,
}

export type Tconfig<T> = {
    DIR_PATH: string
    model: DataModels
    multImages: boolean
}

export async function isValidDocument<T>(doc: unknown) {
    if (
        !doc ||
        typeof doc != 'object' ||
        !('validate' in doc) ||
        typeof doc?.validate != 'function'
    )
        return false
    try {
        await doc.validate()
        return doc
    } catch (error) {
        console.log(error)
        return false
    }
}

export function collectFromForm<T>(form: FormData, config: Tconfig<T>) {
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

export function imagesDiff<T>(
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

export function collectQueries<T>(
    params: URLSearchParams | Record<string, string | string[] | undefined>,
    config: Tconfig<T>
) {
    const query: Partial<{ [i: string]: string | string[] }> = {}
    for (const [key, value] of Object.entries(params)) {
        if (value && key in config.model.columns) {
            let test: string | string[] = ''
            try {
                test = decodeURIComponent(value).split(',')
            } catch (e) {
                test = ''
            }
            query[key] = test
        }
    }
    if ('name' in query) {
        //TODO
        query['name'] = new RegExp(query['name'] as string) as any as string
    }
    return query
}

export function formatImages<T>(propsImages: unknown, config: Tconfig<T>) {
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
