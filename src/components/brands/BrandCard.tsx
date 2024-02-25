import { Brand } from "@/lib/Models/index"
import Image from "next/image"
import Link from "next/link"
type Props = {
	brand: Brand
	products: number
	className?: string
}
export default function BrandCard({ brand, products, className }: Props) {
	return (
		<article
			title={brand.name}
			className={`h-40 w-36 rounded-lg border-2 bg-card text-card-foreground shadow-lg ${className}`}
		>
			<Link href={`/shop?brand=${brand.name}`}>
				<main className="flex flex-col items-center justify-center rounded-lg p-2">
					<Image
						className="size-20 rounded-lg"
						width={245}
						height={195}
						alt={brand.name}
						src={`/brands/${brand.image}`}
					/>
					<h2 className="w-full overflow-hidden overflow-ellipsis text-center text-2xl font-semibold">
						{brand.name}
					</h2>
					<span className="text-xl font-medium">
						{`${products} item${products % 10 === 1 ? "" : "s"}`}
					</span>
				</main>
			</Link>
		</article>
	)
}
