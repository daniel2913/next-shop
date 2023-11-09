import ImageComponent from '../ImageComponent'
import React from 'react'
type props = {
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

export default function ImagesPreview({ images, delImage }: props) {
    const imageUrls = React.useMemo<string[]>(() => {
        return previewImages(images)
    }, [images])
    return (
        <div>
            {imageUrls.map((image, idx) => {
                return image ? (
                    <div key={image}>
                        <button onClick={() => delImage(idx)}>X</button>
                        <ImageComponent
                            alt=""
                            width={30}
                            height={50}
                            fallback="template.jpeg"
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
