import React from "react";
import Cross from "@public/cross.svg";
import Image from "next/image";
interface Props {
	className: string;
	images: File[];
	delImage: (idx: number) => void;
}

const currentImageUrls: string[] = [];

function previewImages(images: File[]) {
	let res: string[] = [];
	if (!images) res = [];
	if (images instanceof File) res = [URL.createObjectURL(images)];
	for (const idx in images) {
		res.push(URL.createObjectURL(images[idx]));
	}
	currentImageUrls.push(...res);
	return res;
}

export default function ImagesPreview({ images, delImage, className }: Props) {
	const imageUrls = React.useMemo<string[]>(() => {
		return previewImages(images);
	}, [images]);
	return (
		<div className={`${className} flex gap-2`}>
			{imageUrls.map((image, idx) => {
				return image ? (
					<div className="relative h-7 w-8 object-fill" key={image}>
						<button
							type="button"
							className="absolute right-0 top-0 z-10 appearance-none"
							onClick={() => delImage(idx)}
						>
							<Cross className="stroke-destructive" width={15} height={15} />
						</button>
						<Image alt="" className="" fill src={image} />
					</div>
				) : null;
			})}
		</div>
	);
}
