import { Brand } from "@/lib/Models/index"
import { Card, CardContent } from "@/components/ui/Card"
import Image from "next/image"
import Link from "next/link"
type Props = {
	brand: Brand
	products: number
	className: string
}
export default function BrandCard({ brand, products, className }: Props) {
	return (
		<Card
			title={brand.name}
			className={`${className} h-30 w-40 bg-background text-center`}
		>
			<Link href={`/shop?brand=${brand.name}`}>
				<CardContent className="flex h-full w-full flex-col items-center rounded-lg p-2">
					<div className="relative h-28 w-28">
						<Image
							className="h-full w-full rounded-lg"
							width={245}
							height={195}
							alt={brand.name}
							src={`/brands/${brand.image}`}
						/>
					</div>
					<h2 className="w-full overflow-hidden overflow-ellipsis text-2xl font-semibold">
						{brand.name}
					</h2>
					<span className="text-xl font-medium">
						{`${products} item${products % 10 === 1 ? "" : "s"}`}
					</span>
				</CardContent>
			</Link>
		</Card>
	)
}
