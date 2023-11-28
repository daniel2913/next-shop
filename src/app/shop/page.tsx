import ProductList from "@/components/Products"
import { Session } from "next-auth"

export default function Shop({
	params,
	searchParams,
	session
}: {
	session:Session|null
	params: { link: string }
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	return (
		<div className="">
			<ProductList params={params} session={session} searchParams={searchParams} />
		</div>
	)
}
