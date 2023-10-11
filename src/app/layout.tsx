import ModalBase from '@/components/modals/Base'
import NavBar from '@comps/NavBar'
import '@styles/index.scss'
import { ReactElement, ReactNode } from 'react'
import RootProviders from './providers'

export const metadata = {
    title: 'Next shop',
    description: 'This is shop and it is in next',
}

interface LayoutProps {
    children: ReactElement
}

export default async function Layout({ children }: LayoutProps) {
    return (
        <>
            <html lang="en">
                <head>
                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <title>Document</title>
                </head>
                <body>
                    <RootProviders>
                        <NavBar />
                        {children}
                        <ModalBase />
                    </RootProviders>
                </body>
            </html>
        </>
    )
}