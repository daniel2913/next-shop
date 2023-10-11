'use client'

import Star from '@public/star.svg'
import styles from './Rating.module.scss'
import React from 'react'

interface RatingI {
    rating: number
    ownRating?: number
}

export default function Rating({ rating, ownRating = 0 }: RatingI) {
    const [rated, setRated] = React.useState(0)
    const ratings = [1, 2, 3, 4, 5]

    return (
        <div className={styles.stars}>
            <div className={styles.progress}></div>
            {ratings.map((i) => {
                return (
                    <button
                        key={i}
                        onClick={() => setRated(i)}
                        className={styles.button}
                        id={i + ''}
                    >
                        <Star
                            className={
                                ((i <= rating && styles.active) || '') +
                                ' ' +
                                ((i == rated && styles.rated) || '') +
                                ' ' +
                                ((i < ownRating && styles.underRated) || '')
                            }
                        />
                    </button>
                )
            })}
        </div>
    )
}
