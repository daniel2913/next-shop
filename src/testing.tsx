import image from '@public/freezerSmall.jpg'
import image2 from '@public/freezer2.jpg'
import image3 from '@public/freezer3.jpg'
import brandImage from '@public/brands/template.jpeg'

export const sample = {
    images: [image, image2, image3],
    name: 'Freezer',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, sapiente!',
    price: 1000,
    brandName: 'Xen',
    brandImage: brandImage,
    category: 'appliances',
    discount: 30,
}

export const biggerSample = (() => {
    let res = []
    for (let i = 0; i < 10; i++) {
        res.push(sample)
    }
    return res
})()
export const smallerSample = (() => {
    let res = []
    for (let i = 0; i < 3; i++) {
        res.push(sample)
    }
    return res
})()
