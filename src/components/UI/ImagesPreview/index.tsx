import React from "react"
import Cross from "@public/cross.svg"
interface Props {
	className: string
	images: File[]
	delImage: (idx: number) => void
}

const currentImageUrls: string[] = []

function previewImages(images: File[]) {
	for (const image of currentImageUrls) {
		URL.revokeObjectURL(image)
	}
	let res: string[] = []
	if (!images) res = []
	if (images instanceof File) res = [URL.createObjectURL(images)]
	for (const idx in images) {
		res.push(URL.createObjectURL(images[idx]))
	}
	currentImageUrls.push(...res)
	return res
}

export default function ImagesPreview({ images, delImage, className }: Props) {
	const imageUrls = React.useMemo<string[]>(() => {
		return previewImages(images)
	}, [images])
	return (
		<div className={`${className} flex gap-2`}>
			{imageUrls.map((image, idx) => {
				return image ? (
					<div
						className="relative"
						key={image}
					>
						<button
							className="absolute right-0 top-0 text-accent1-500"
							onClick={() => delImage(idx)}
						>
							<Cross className="stroke-destructive" width="15px" height="15px"/>
						</button>
						<img
							alt=""
							width={30}
							height={50}
							src={image}
						/>
					</div>
				) : (
					<></>
				)
			})}
		</div>
	)
}
