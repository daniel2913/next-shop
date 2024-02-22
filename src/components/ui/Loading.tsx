import React from "react"
import Spinner from "@public/loading.svg"

type Props = {
	children: React.ReactNode
	fallback?: React.ReactNode
	loading?: boolean
}
export default function Loading(props: Props) {
	const fallback = props.fallback ? (
		props.fallback
	) : (
		<div className="relative h-full w-full">
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
				<Spinner
					className="animate-spin *:stroke-foreground"
					width={50}
					height={50}
				/>
			</div>
		</div>
	)
	return props.loading ? (
		fallback
	) : (
		<React.Suspense fallback={fallback}>{props.children}</React.Suspense>
	)
}
