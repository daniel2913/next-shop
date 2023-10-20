import NavBar from '@comps/NavBar'
import '@styles/index.scss'
import { ReactElement } from 'react'

interface LayoutProps {
    children: ReactElement
}

export default async function ShopLayout({ children }: LayoutProps) {
    return (
        <>
            <NavBar />
            {children}
        </>
    )
}
