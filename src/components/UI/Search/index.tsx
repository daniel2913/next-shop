'use client'
import styles from './index.module.scss'
import { Brand, Category, Product } from '@/lib/DAL/MongoModels'
import { useRouter } from 'next/navigation'
import React from 'react'

type props = {
    goTo: (val: string) => void
}

export default function Search() {
    const router = useRouter()
    const [queryString, setQueryString] = React.useState<string>('')
    const [brands, setBrands] = React.useState<
        { brand: Brand; checked: boolean }[]
    >([])
    const [categories, setCategories] = React.useState<
        { category: Category; checked: boolean }[]
    >([])
    React.useEffect(() => {
        Promise.all([fetch('/api/brand'), fetch('/api/category')]).then(
            ([brands, cats]) => {
                Promise.all([brands.json(), cats.json()]).then(
                    ([brands, cats]) => {
                        setBrands(
                            brands.map((brand) => ({
                                brand,
                                checked: false,
                            }))
                        )
                        setCategories(
                            cats.map((category) => ({
                                category,
                                checked: false,
                            }))
                        )
                    }
                )
            }
        )
    }, [])
    async function onClick() {
        const query = new URL('shop', 'http://localhost:5000')
        const queryCats = categories.filter((category) => category.checked)
        const queryBrands = brands.filter((brand) => brand.checked)
        query.searchParams.set('name', queryString)
        query.searchParams.set(
            'category',
            queryCats.length === 0
                ? ''
                : queryCats.map((cat) => cat.category.name)
        )
        query.searchParams.set(
            'brand',
            queryBrands.length === 0
                ? ''
                : queryBrands.map((brand) => brand.brand.name)
        )
        router.push(query.toString())
    }
    function onBrandCheck(name: string) {
        setBrands(
            brands.map((brand) => ({
                ...brand,
                checked:
                    name === brand.brand.name ? !brand.checked : brand.checked,
            }))
        )
    }

    function onCategoryCheck(name: string) {
        setCategories(
            categories.map((category) => ({
                ...category,
                checked:
                    name === category.category.name
                        ? !category.checked
                        : category.checked,
            }))
        )
    }
    return (
        <>
            <input
                type="search"
                name="searchQuery"
                id="searchQuery"
                value={queryString}
                onChange={(e) => setQueryString(e.currentTarget.value)}
            />
            <button onClick={onClick}> Search </button>
            <div className={styles.checkboxes}>
                <div className={styles.categories}>
                    {categories.map((category) => {
                        return (
                            <div key={'category' + category.category.name}>
                                <input
                                    type="checkbox"
                                    id={category.category.name}
                                    name={category.category.name}
                                    checked={category.checked}
                                    onChange={() =>
                                        onCategoryCheck(category.category.name)
                                    }
                                />
                                <label htmlFor={category.category.name}>
                                    {category.category.name}
                                </label>
                            </div>
                        )
                    })}
                </div>
                <br />
                <div className={styles.brands}>
                    {brands.map((brand) => {
                        return (
                            <div key={'brand' + brand.brand.name}>
                                <input
                                    type="checkbox"
                                    id={brand.brand.name}
                                    name={brand.brand.name}
                                    checked={brand.checked}
                                    onChange={() =>
                                        onBrandCheck(brand.brand.name)
                                    }
                                />
                                <label htmlFor={brand.brand.name}>
                                    {brand.brand.name}
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
