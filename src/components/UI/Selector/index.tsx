'use client'

import React from 'react'
import styles from './index.module.scss'

type props = {
    options: string[]
    className?: string
    id: string
    label: string
    value: string
    setValue: (a: string) => void
}

export default function Selector({
    options,
    className,
    id,
    label,
    value,
    setValue,
}: props) {
    const [open, setOpen] = React.useState<boolean>(false)
    React.useEffect(() => {
        setValue(options[0])
    }, [])
    return (
        <div
            onBlur={() => setOpen(false)}
            className={`${className} ${styles.selector}`}
        >
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input
                placeholder="Not Found..."
                className={styles.current}
                onFocus={() => setOpen((prev) => !prev)}
                type="text"
                value={value}
                name={id}
                id={id}
            />
            <div aria-hidden={!open} className={styles.variants}>
                <ul>
                    {options.map((option) => (
                        <li key={option}>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setValue(option)
                                    e.currentTarget.blur()
                                }}
                                className={styles.variant}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
