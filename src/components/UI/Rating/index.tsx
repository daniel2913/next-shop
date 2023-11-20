"use client";

import Star from "@public/star.svg";
import React from "react";

interface props {
    rating: number;
    ownRating?: number;
    className: string;
}

export default function Rating({ className, rating, ownRating = 0 }: props) {
    const [rated, setRated] = React.useState(0);
    const ratings = [1, 2, 3, 4, 5];

    return (
        <div className={`${className}`}>
            {ratings.map((i) => {
                return (
                    <button
                        type="button"
                        key={i}
                        onClick={() => setRated(i)}
                        className=""
                        id={`${i}`}
                    >
                        <Star className="" />
                    </button>
                );
            })}
        </div>
    );
}
