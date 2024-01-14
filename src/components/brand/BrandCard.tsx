import {Brand} from "@/lib/DAL/Models/index"
import {Card, CardBody} from "@/components/material-tailwind"
import Image from "next/image"
import Link from "next/link"
type Props = {
	brand:Brand
	products:number
	className:string
}
export default function BrandCard({brand,products,className}:Props){
	return (
		<Card
			className={`${className} text-center`}
		>
			<CardBody
				className="h-full w-full flex flex-col items-center"
			>
				<Link href={`/shop?brand=${brand.name}`}>
				<div
					className="relative h-28 w-28"
				>
				<Image
					fill
					alt={brand.name}
					src={`/brands/${brand.image}`}
				/>
				</div>
				<h3>{brand.name}</h3>
				<span>
					{`${products} item${products%10===1 ? "" : "s"}`}
				</span>
				</Link>
			</CardBody>
		</Card>
	)
}
