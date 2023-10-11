import { UserModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'
import Image from 'next/image'
import styles from './page.module.scss'

interface props {
    login: string
    avatar: string
    con: any
}

export async function getUser(profile: string) {
    await dbConnect()
    const user = (await UserModel.find({ username: profile }).exec())[0]
    const image: string | undefined = user.image
    return { user: { userName: user.username, image: image } }
}

export default async function Profile({
    params,
    searchParams,
}: {
    params: { profile: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const route = params.profile
    if (!route) throw 'no route'
    const { user } = await getUser(Array.isArray(route) ? route[0] : route)
    return (
        <div className={styles.pageWrapper}>
            <Image
                src={`/users/${user?.image || 'template.jpeg'}`}
                height={150}
                width={150}
                alt="Profile picture"
            />
            <h2 className={styles.login}>{user.userName}</h2>
            <h1>{user.userName}</h1>
        </div>
    )
}
