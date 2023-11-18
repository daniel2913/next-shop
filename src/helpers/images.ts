import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import { FileStorage } from '@/lib/DAL/FileStorage'

export type Image = { file: File | null; name: string }
const template = { name: 'template.jpg', file: null }

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
    let imageName = 'template.jpg'
    const ext = image.type?.split('/').pop()
    if (ext == 'jpeg' || ext === 'jpg') {
        imageName = new mongoose.Types.ObjectId().toString() + '.jpg'
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
    if (name === 'template.jpg') return true
    if (!file) return false
    return FileStorage.write(name, filePath, file)
}

export function deleteImage(name: string, filePath: string): void {
    if (name === 'template.jpg') return
    FileStorage.delete(name, filePath)
}
