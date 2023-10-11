import React from 'react'
import styles from './index.module.scss'
import { getVariants } from '@/Actions/getVariants'
interface props {
    type: 'category' | 'brand'
    className?: string
    id: string
    label: string
}
interface variant {
    name: string
    id: string
}

export default function Selector({ type, className, id, label }: props) {
    const [variants, setVariants] = React.useState<variant[]>([])
    const [selected, setSelected] = React.useState<variant>()
    const [open, setOpen] = React.useState<boolean>(false)
    React.useEffect(() => {
        async function fetchVariants(type: string) {
            const variants = await getVariants(type)
            setVariants(variants)
            setSelected(variants[0])
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
                        <li key={variant.id}>
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
