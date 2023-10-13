'use server'
import { BrandModel } from '@/lib/DAL/MongoModels'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import createNewBrand from '@/lib/DAL/Controllers/brandController/createNewBrand'
import dbConnect from '@/lib/dbConnect'

export async function handleNewBrandForm(form: FormData) {
    'use server'
    const name = form.get('name') as string
    const description = form.get('description') as string
    const link = form.get('link') as string
    const image = (form.get('image') as File) || null
    if (!name || !description || !link) return 'Not all fields are filled!'
    const res = await prepareNewBrand({ name, description, link, image })
    return res
}

interface props {
    name: string
    description: string
    link: string
    image: File | null
}

async function prepareNewBrand({ name, description, link, image }: props) {
    dbConnect()
    if (await BrandModel.exists({ name })) return 'Brand already exists!'
    let imageName = 'template.jpeg'
    if (image) {
        const ext = image.type?.split('/').pop()
        if (ext == 'jpeg' || ext == 'png') {
            imageName = new mongoose.Types.ObjectId().toString() + '.' + ext
            fs.writeFile(
                path.resolve('./public/brands/' + imageName),
                Buffer.from(await image.arrayBuffer())
            )
        }
    }
    const res = await createNewBrand({
        name,
        description,
        link,
        image: imageName,
    })
    return res
}
