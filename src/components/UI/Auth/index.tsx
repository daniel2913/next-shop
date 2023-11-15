import Link from 'next/link'
import styles from './index.module.scss'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'

export default async function Auth() {
    const session =await getServerSession(authOptions)
	const name = session?.user?.name ? session?.user?.name : 'Guest'
    return (
        <div className={styles.auth}>
					{session?.user?.name 
					? <div>
						<Link href={`/profile/${name}`}>
							{name}
						</Link>
						<Link href='/api/auth/signout'>Log out</Link>
					</div>
                    :
					<div>
						<span>{name}</span>
						<Link href='/api/auth/signin'>Log in</Link>
					</div>
					}                  
        </div>
    )
}
