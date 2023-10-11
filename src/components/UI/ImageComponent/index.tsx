'use client'

import Image from 'next/image'
import styles from './index.modules.scss'
import { useState } from 'react'

interface props {
    src: string
    fallback: string
    alt: string
    height: number
    width: number
    className?: string
}

export default function ImageComponent(props: props) {
    const [image, setImage] = useState(props.src)
    const [error, setError] = useState(false)
    function fallback() {
        if (image.includes('template.jpeg') && image.includes('/api/'))
            setError(true)
        if (image.includes('/api/')) setImage(props.fallback)
        else setImage('/api' + props.src)
    }
    return error ? (
        <div>Error!</div>
    ) : (
        <Image
            className={props.className}
            src={image}
            onError={() => fallback()}
            width={props.width}
            alt={props.alt}
            height={props.height}
        />
    )
}
