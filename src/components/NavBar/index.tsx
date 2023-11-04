'use client'

import Link from 'next/link'
import styles from './index.module.scss'

import React from 'react'
import Auth from '../ui/Auth'
import CartStatus from '../cart/Status'
import CategoryForm from '@/hooks/modals/forms/useCategoryForm'
import ProductForm from '@/hooks/modals/forms/useProductForm'

export default function NavBar() {
    //  const modal = React.useRef(useProductForm())
    return (
        <header className={styles.navbar}>
            <div className={styles.logo}></div>

            <div className={styles.navbarContent}>
                <Link href="/">Home</Link>
                <Link href="/Product/AddProduct">Add Product</Link>
                <Link href="/">Users</Link>
                <Link href="/Register">Create User</Link>
            </div>
            <div className={styles['login']}>
                <CartStatus />
                <Auth />
            </div>
        </header>
    )
}
