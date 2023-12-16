"use client"
import React from "react"
import ArrowStraight from "@public/arrowStraight.svg"
interface Props {
	children: React.ReactNode[]
	brandImage?: React.ReactNode
	discount?: React.ReactNode
	className?: string
	carouselClassName?: string
	previewClassName?: string
	preview?: boolean
}

const getPos = (i: number, len: number) => (i + len) % len

export default function Carousel({
	className,
	children,
	brandImage,
	discount,
	preview,
	carouselClassName,
	previewClassName,
}: Props) {
	const [current, setCurrent] = React.useState(0)
	function changeSlide(n: number) {
		setCurrent(getPos(n, children.length))
	}
	const currentImages = React.useMemo(() => {
		return children.map((image, i) => {
			if (
				i === current ||
				i === getPos(current + 1, children.length) ||
				i === getPos(current - 1, children.length)
			)
				return (
					<div
						key={i}
						className={`${i === current ? "block" : "hidden"}`}
					>
						{image}
					</div>
				)
			else return null
		})
	},[current,children])
	return (
		<div className={`${className} relative mx-auto`}>
			<div className={`${carouselClassName}`}>
				{currentImages}
			</div>
			<div className="f-10 absolute left-2 top-2">{brandImage}</div>
			<div className="absolute bottom-2 right-2 z-10">{discount}</div>
			<button
				type="button"
				onClick={() => changeSlide(current - 1)}
				className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 border-none"
			>
				<ArrowStraight
					width={30}
					height={30}
					className=""
				/>
			</button>
			<button
				type="button"
				onClick={() => changeSlide(current + 1)}
				className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 border-none"
			>
				<ArrowStraight
					width={30}
					height={30}
					className=""
				/>
			</button>
			{preview ? (
				null
			) : (
				<div className="absolute bottom-0 right-1/2 z-10 flex translate-x-1/2 justify-center gap-1">
					{children.map((_, i) => {
						return (
							<button
								type="button"
								key={Math.random().toString()}
								onClick={() => changeSlide(i)}
								aria-expanded={i === current}
								className="aspect-square w-4 rounded-full bg-gray-100 bg-opacity-50 hover:bg-gray-300 aria-expanded:bg-gray-200"
							/>
						)
					})}
				</div>
			)}
			{preview ? (
				<div className={`${previewClassName} flex justify-center gap-2`}>
					{children.map((image, i) => (
						<button
							className="relative h-full w-10"
							type="button"
							key={Math.random().toString()}
							onClick={() => changeSlide(i)}
							aria-expanded={i === current}
						>
							{image}
						</button>
					))}
				</div>
			) :
				null
			}
		</div>
	)
}

