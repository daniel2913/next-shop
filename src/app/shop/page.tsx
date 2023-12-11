import ProductList from "@/components/Products"
import { Session } from "next-auth"

export default function Shop({
	searchParams,
}: {
	session: Session | null
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	return (
		<div className="">
			<ProductList searchParams={searchParams} />
		</div>
	)
}
