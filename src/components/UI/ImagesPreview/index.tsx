import ImageComponent from '../ImageComponent'

type props = {
    images: string[]
    delImage: (idx: number) => void
}

export default function ImagesPreview({ images, delImage }: props) {
    return (
        <>
            {images.map((image, idx) => {
                ;<>
                    <button onClick={() => delImage(idx)}>X</button>
                    <ImageComponent
                        alt=""
                        width={30}
                        height={50}
                        fallback="template.jpeg"
                        src={image}
                    />
                </>
            })}
        </>
    )
}
