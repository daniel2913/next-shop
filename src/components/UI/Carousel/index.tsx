"use client"

import React, { ReactNode, useState } from "react"
import ArrowStraight from "@public/arrowStraight.svg"
import Image from "next/image"
interface Props {
	children: ReactNode[]
	brandImage?: ReactNode
	discount?: ReactNode
	className?: string
	carouselClassName?: string
	previewClassName?: string
	preview?: boolean
}

const getPos = (i: number, len: number) => (i + len) % len

function Carousel({ className, children, brandImage, discount, preview, carouselClassName, previewClassName }: Props) {
	const [current, setCurrent] = useState(0)
	function changeSlide(n: number) {
		setCurrent(getPos(n, children.length))

	}
	return (
		<div
			className={`${className} relative mx-auto`}
		>
			{" "}
			<div
				className={`${carouselClassName}`}
			>
				{children.map((image, i) => {
					if (
						i === current ||
						i === getPos(current + 1, children.length) ||
						i === getPos(current - 1, children.length)
					)
						return <div className={`${i === current ? "block" : "hidden"}`}>{image}</div>
					else
						return <></>
				}

				)}
				{children[current]}
			</div>
			<div
				className="absolute top-2 left-2 z-40"
			>
				{brandImage}
			</div>
			<div
				className="absolute bottom-2 right-2 z-40"
			>
				{discount}
			</div>
			<button
				type="button"
				onClick={() => changeSlide(current - 1)}
				className="absolute top-1/2 -translate-y-1/2 left-2 -rotate-90 border-none"
			>
				<ArrowStraight width={30} height={30} className="" />
			</button>
			<button
				type="button"
				onClick={() => changeSlide(current + 1)}
				className="absolute top-1/2 -translate-y-1/2 right-2 rotate-90 border-none"
			>
				<ArrowStraight width={30} height={30} className="" />
			</button>
			{preview
				? <></>
				: <div className="absolute bottom-0 right-1/2 translate-x-1/2 flex gap-1 justify-center z-50">
					{children.map((_, i) => {
						return (
							<button
								type="button"
								key={i}
								onClick={() => changeSlide(i)}
								aria-expanded={i === current}
								className="w-4 aspect-square rounded-full bg-gray-100 hover:bg-gray-300 aria-expanded:bg-gray-200 bg-opacity-50"
							/>
						)
					})}
				</div>}
			{preview
				? <div
					className={`${previewClassName} flex gap-2 justify-center`}
				>
					{
						children.map((image, i) => (
							<button
								className="w-10 h-full relative"
								type='button'
								key={i}
								onClick={() => changeSlide(i)}
								aria-expanded={i === current}
							>
								{image}
							</button>
						))
					}
				</div>
				: <></>

			}
		</div>
	)
}

export default Carousel
