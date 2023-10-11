'use server'
import { CategoryModel } from '@/lib/DAL/MongoModels'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import createNewCategory from '@/lib/DAL/Controllers/categoryController/createNewCategory'

export async function handleNewCategoryForm(form: FormData) {
    'use server'
    const name = form.get('name') as string
    const image = (form.get('image') as File) || null
    if (!name) return 'Not all fields are filled!'
    const res = await prepareNewCategory({ name, image })
    return res
}

interface props {
    name: string
    image: File | null
}

async function prepareNewCategory({ name, image }: props) {
    if (await CategoryModel.exists({ name })) return 'Category already exists!'
    let imageName = 'templage.jpeg'
    if (image) {
        const ext = image.type?.split('/').pop()
        if (ext == 'jpeg' || ext == 'png') {
            imageName = new mongoose.Types.ObjectId().toString() + '.' + ext
            fs.writeFile(
                path.resolve('./public/categories/' + imageName),
                Buffer.from(await image.arrayBuffer())
            )
        }
    }
    const res = await createNewCategory({ name, image: imageName })
    return res
}
