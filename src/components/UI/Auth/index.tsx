'use client'
import Link from 'next/link'
import styles from './index.module.scss'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Auth() {
    const { data: session, status } = useSession()
    return (
        <div className={styles.auth}>
            {status === 'authenticated' ? (
                <div>
                    <Link href={`/Profile/${session.user?.name}`}>
                        {session.user?.name}
                    </Link>
                    <button onClick={() => signOut()}>Log out</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => signIn()}>Log in</button>
                </div>
            )}
        </div>
    )
}
