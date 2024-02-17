import React from "react"
import {Category} from "@/lib/Models/index"
import {Card, CardContent} from "@/components/ui/Card"
import Image from "next/image"
import Link from "next/link"
type Props = {
	category:Category
	products:number
	className?:string
}
export default function CategoryCard({category,products,className}:Props){
	return (
		<Card
			title={category.name}
			className={`${className} w-40 h-30 text-center bg-secondary`}
		>
			<Link href={`/shop?category=${category.name}`}>
			<CardContent
				className="h-full p-2 rounded-lg w-full  flex flex-col items-center"
			>
				<div
					className="relative h-28 w-28"
				>
				<Image
					className="rounded-lg h-full w-full"
					width={245}
					height={195}
					alt={category.name}
					src={`/categories/${category.image}`}
				/>
				</div>
				<h2 className="text-2xl w-full font-semibold overflow-hidden overflow-ellipsis">{category.name}</h2>
				<span className="text-xl font-medium">
					{`${products} item${products%10===1 ? "" : "s"}`}
				</span>
			</CardContent>
			</Link>
		</Card>
	)
}
