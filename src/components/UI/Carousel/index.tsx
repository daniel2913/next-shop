"use client"
import React from "react"
import { Carousel as BaseCarousel } from "@/components/material-tailwind"
interface Props {
	children: React.ReactNode[]
	brandImage?: React.ReactNode
	discount?: React.ReactNode
	className?: string
	carouselClassName?: string
	previewClassName?: string
	preview?: boolean
}

export default function Carousel({
	className,
	children,
	brandImage,
	discount,
	preview,
	carouselClassName,
	previewClassName,
}: Props) {
	return (
		<div className={`${className}`}>
			<BaseCarousel
				className={`${carouselClassName}`}
				loop
				navigation={preview
					?
					({ setActiveIndex, activeIndex }) =>
						<div className={`${previewClassName} flex justify-center gap-2`}>
							{children.map((image, i) => (
								<button
									className="relative h-full w-10"
									type="button"
									key={Math.random().toString()}
									onClick={() => setActiveIndex(i)}
									aria-expanded={i === activeIndex}
								>
									{image}
								</button>
							))}
						</div>
					: undefined
				}
			>
				{children}
			</BaseCarousel>
			<div className="f-10 absolute left-2 top-2">{brandImage}</div>
			<div className="absolute bottom-2 right-2 z-10">{discount}</div>
		</div>
	)
}

