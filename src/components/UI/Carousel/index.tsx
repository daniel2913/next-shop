"use client";

import React, { ReactNode, useState } from "react";
import ArrowStraight from "@public/arrowStraight.svg";

interface props {
    children: ReactNode[];
    brandImage?: ReactNode;
    discount?: ReactNode;
    className?: string;
}

const getPos = (i: number, len: number) => (i + len) % len;

function Carousel({ className, children, brandImage, discount }: props) {
    const [current, setCurrent] = useState(0);
    function changeSlide(n: number) {
        let cur = n;
        if (cur < 0) cur += children.length;
        cur %= children.length;
        setCurrent(cur);
    }
    return (
        <div
            className={`
              ${className} relative mx-auto
            `}
        >
            {" "}
            <div
                className="
                 h-1/2
                "
            >
                {children[current]}
            </div>
            <div
                className="
                    absolute top-2 left-2 z-40
                "
            >
                {brandImage}
            </div>
            <div
                className="
                   absolute bottom-2 right-2 z-40
                "
            >
                {discount}
            </div>
            <button
                type="button"
                onClick={() => changeSlide(current - 1)}
                className="
                    absolute top-1/2 -translate-y-1/2 left-2 -rotate-90
                    border-none
                "
            >
                <ArrowStraight width={30} height={30} className="" />
            </button>
            <button
                type="button"
                onClick={() => changeSlide(current + 1)}
                className="
                    absolute top-1/2 -translate-y-1/2 right-2 rotate-90
                    border-none
                "
            >
                <ArrowStraight width={30} height={30} className="" />
            </button>
            <div className="">
                {children.map((_, i) => {
                    return (
                        <button
                            type="button"
                            key={i}
                            onClick={() => changeSlide(i)}
                            aria-expanded={i === current}
                            className=""
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Carousel;
