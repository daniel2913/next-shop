import Link from 'next/link'
import styles from './index.module.scss'

import React from 'react'
import Auth from '../ui/Auth'
import CartStatus from '../cart/Status'
import Search from '../ui/Search'
import { BrandModel, CategoryModel } from '@/lib/DAL/Models'

export const revalidate = 300

export default async function NavBar() {
    const [brands,categories] = await Promise.all([BrandModel.find(undefined),CategoryModel.find(undefined)]) 
    return (
        <header className={styles.navbar}>
            <div className={styles.logo}></div>
            <Search brandList={brands} categoryList={categories}/>
            <div className={styles.navbarContent}>
                <Link href="/">Home</Link>
                <Link href="/product/AddProduct">Add Product</Link>
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
