'use client'

import Link from 'next/link'
import styles from './index.module.scss'

import React from 'react'
import Auth from '../UI/Auth'
import Cart from '../Cart'


export default function NavBar() {
    return (
        <header className={styles.navbar}>
            <div className={styles.logo}></div>
            <div className={styles.searchbar}>
                <label htmlFor="searchbar">Search for products</label>
                <input id="searchbar" placeholder="Search..." type="text" />
            </div>
            <div className={styles.navbarContent}>
                <Link href="/">Home</Link>
                <Link href="/Product/AddProduct">Add Product</Link>
                <Link href="/">Users</Link>
                <Link href="/Register">Create User</Link>
            </div>
            <div className={styles['login']}>
                <Cart/>
                <Auth />
            </div>
        </header>
    )
}