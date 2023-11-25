import Carousel from "@/components/ui/Carousel"
import { ProductModel } from "@/lib/DAL/Models"
import { redirect } from "next/navigation"
import Image from "next/image"
interface Props{
	params:{
		brand:string
		product:string
	}
}



export default async function ProductPage({params}:Props){
	const product = await ProductModel.findOne({brand:params.brand,name:params.product})
	if (!product) redirect('/shop')
	
	return (
		<div>
			<Carousel>
				{product.images.map(image=>
					<Image
						alt={product.name}
						fill
						src={`/public/products/${image}`}
					/>
				)}
			</Carousel>
			
			<Image
				alt={product.name}
				src={`/public/products/${product.}`}
			/>

		</div>

	)
}

