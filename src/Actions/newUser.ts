'use server'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import { createNewUser } from '../lib/DAL/Controllers/userController'
import dbConnect from '../lib/dbConnect'
import { createHash } from 'crypto'

interface props {
    username: string
    password: string
    image: File
}

export async function handleRegistrationForm(form: FormData) {
    'use server'
    const username = form.get('username') as string
    const password = form.get('password') as string
    const image = (form.get('image') as File) || null
    if (!username || !password) return 'Not all fields are filled!'
    await prepareNewUser({ username, password, image })
    return 'Registration succesfull!'
}

export default async function prepareNewUser({
    image,
    password,
    username,
}: props) {
    await dbConnect()
    const hash = createHash('sha256')
    hash.update(password)
    hash.update(username)
    const passwordHash = hash.digest('base64')
    let imageName = undefined
    const ext = image.type?.split('/').pop()
    if (ext == 'jpeg' || ext == 'png') {
        imageName = new mongoose.Types.ObjectId().toString() + '.' + ext
        fs.writeFile(
            path.resolve('./public/users/' + imageName),
            Buffer.from(await image.arrayBuffer())
        )
    }
    createNewUser({ image: imageName, username: username, passwordHash })
}
