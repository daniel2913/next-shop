import {Brand} from "@/lib/DAL/Models/index"
import {Card, CardContent} from "@/components/UI/card"
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
			title={brand.name}
			className={`w-40 h-30 text-center`}
		>
			<Link href={`/shop?brand=${brand.name}`}>
			<CardContent
				className="h-full p-2 rounded-lg w-full bg-secondary flex flex-col items-center"
			>
				<div
					className="relative h-28 w-28"
				>
				<Image
					className="rounded-lg h-full w-full"
					width={245}
					height={195}
					alt={brand.name}
					src={`/brands/${brand.image}`}
				/>
				</div>
				<h3 className="text-2xl w-full font-semibold overflow-hidden overflow-ellipsis">{brand.name}</h3>
				<span className="text-xl font-medium">
					{`${products} item${products%10===1 ? "" : "s"}`}
				</span>
			</CardContent>
			</Link>
		</Card>
	)
}
