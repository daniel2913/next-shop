'use client'

import React from 'react'
import styles from './index.module.scss'

type props = {
    type: 'category' | 'brand'
    className?: string
    id: string
    label: string
}

type Variant = {
    _id: string
    name: string
}

export default function Selector({ type, className, id, label }: props) {
    const [variants, setVariants] = React.useState<Variant[]>([])
    const [selected, setSelected] = React.useState<Variant>()
    const [open, setOpen] = React.useState<boolean>(false)
    function error(text: string) {
        setVariants([{ name: text, _id: '' }])
        setSelected({ name: text, _id: '' })
    }
    React.useEffect(() => {
        async function fetchVariants(type: string) {
            const data = await fetch('/api/' + type)
            if (data.status != 200) {
                error('Network Error')
            } else {
                try {
                    const variants: Variant[] = (await data.json()).map(
                        (datum: { name: string; _id: string }) => ({
                            name: datum.name,
                            _id: datum._id,
                        })
                    )
                    setVariants(variants)
                    setSelected(variants[0])
                } catch {
                    error('DataType Error')
                }
            }
        }
        fetchVariants(type)
    }, [type])

    return (
        <div
            onBlur={() => setOpen(false)}
            className={`${className} ${styles.selector}`}
        >
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input
                placeholder="Loading..."
                className={styles.current}
                onFocus={() => setOpen((prev) => !prev)}
                type="text"
                value={selected?.name}
                name={id}
                id={id}
            />
            <div aria-hidden={!open} className={styles.variants}>
                <ul>
                    {variants.map((variant) => (
                        <li key={variant._id}>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setSelected(variant)
                                    e.currentTarget.blur()
                                }}
                                className={styles.variant}
                            >
                                {variant.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
