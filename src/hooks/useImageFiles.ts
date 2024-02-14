import { IMAGE_MIME_TYPES } from "@/lib/Models/common"
import React from "react"

export default function useImageFiles(imageUrls:string[]){
	const [images,setImages] = React.useState<File[]>([])
	React.useEffect(()=>{
		async function fetchImages(imageUrls:string[]) {
			const loadingBlobs: Promise<Blob>[] = []
			for (const image of imageUrls) {
				loadingBlobs.push(fetch(image).then(res => res.blob()))
			}
			const loadedFiles = (await Promise.all(loadingBlobs))
				.filter(blob=>IMAGE_MIME_TYPES.includes(blob.type))
				.map((blob,idx) =>
					new File([blob], imageUrls[idx].split("/").at(-1)||"", { type: blob.type })
				)
			setImages([...images, ...loadedFiles])
		}
		fetchImages(imageUrls)
	},[])
	return [images,setImages] as [typeof images,typeof setImages]
}
