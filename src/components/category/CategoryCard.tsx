import React from "react"
import {Category} from "@/lib/DAL/Models/index"
import {Card, CardBody} from "@/components/material-tailwind"
import Image from "next/image"
import Link from "next/link"
type Props = {
	category:Category
	products:number
	className:string
}
export default function CategoryCard({category,products,className}:Props){
	return (
		<Card
			className={`${className} text-center`}
		>
			<CardBody
				className="h-full w-full flex flex-col items-center"
			>
				<Link href={`/shop?category=${category.name}`}>
				<div
					className="relative h-28 w-28"
				>
				<Image
					fill
					alt={category.name}
					src={`/categories/${category.image}`}
				/>
				</div>
				<h3>{category.name}</h3>
				<span>
					{`${products} item${products%10===1 ? "" : "s"}`}
				</span>
				</Link>
			</CardBody>
		</Card>
	)
}
