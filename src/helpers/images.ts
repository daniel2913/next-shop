import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'

export type Image = { file: File | null; name: string }
const template = { name: 'template.jpeg', file: null }
export function handleImages(images: (File | string)[]): Image[] {
    const result: Image[] = []
    for (const i of images) {
        if (!i || typeof i === 'string') {
            result.push(template)
        } else {
            const image = handleImage(i)
            result.push(image ? image : template)
        }
    }
    return result
}

export function handleImage(image: File): Image | null {
    let imageName = 'template.jpeg'
    const ext = image.type?.split('/').pop()
    if (ext == 'jpeg' || ext === 'jpg' || ext == 'png') {
        imageName = new mongoose.Types.ObjectId().toString() + '.' + ext
        return { name: imageName, file: image }
    } else {
        return template
    }
}

export async function saveImages(images: Image[], filePath: string) {
    const results: Promise<boolean>[] = []
    for (const image of images) {
        results.push(saveImage(image, filePath))
    }
    return Promise.all(results).then((results) => {
        return results.reduce((res, cur) => res && cur, true)
    })
}

export function deleteImages(names: string[], filePath: string): void {
    for (const name of names) {
        deleteImage(name, filePath)
    }
}

export async function saveImage(
    { name, file }: Image,
    filePath: string
): Promise<boolean> {
    if (name === 'template.jpeg') return true
    if (!file) return false
    try {
        await fs.writeFile(
            path.resolve(filePath + name),
            Buffer.from(await file.arrayBuffer())
        )
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export function deleteImage(name: string, filePath: string): void {
    if (name === 'template.jpeg') return
    fs.rm(path.resolve(filePath + name))
}
