'use client'

import React, { ReactNode, useState } from 'react'
import styles from './index.module.scss'
import ArrowStraight from '@public/arrowStraight.svg'

interface props {
    children: ReactNode[]
}

const getPos = (i: number, len: number) => (i + len) % len

function Carousel({ children }: props) {
    const [current, setCurrent] = useState(0)
    function changeSlide(n: number) {
        if (n < 0) n = children.length + n
        n = n % children.length
        setCurrent(n)
    }
    return (
        <div className={styles.carousel}>
            <div className={styles.imageContainer}>
                {children[current]}
                {children[getPos(current + 1, children.length)]}
                {children[getPos(current - 1, children.length)]}
            </div>

            <button
                onClick={() => changeSlide(current - 1)}
                className={styles.control + ' ' + styles.left}
            >
                <ArrowStraight
                    width={30}
                    height={30}
                    className={styles.arrow}
                />
            </button>
            <button
                onClick={() => changeSlide(current + 1)}
                className={styles.control + ' ' + styles.right}
            >
                <ArrowStraight
                    width={30}
                    height={30}
                    className={styles.arrow}
                />
            </button>
            <div className={styles.pages}>
                {children.map((_, i) => {
                    return (
                        <button
                            key={i}
                            onClick={() => changeSlide(i)}
                            aria-expanded={i == current}
                            className={styles.page}
                        ></button>
                    )
                })}
            </div>
        </div>
    )
}

export default Carousel
