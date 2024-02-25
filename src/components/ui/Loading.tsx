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
		<div className="relative flex h-full w-full items-center justify-center">
			<Spinner
				className="animate-spin *:stroke-foreground"
				width={50}
				height={50}
			/>
		</div>
	)
	return props.loading ? (
		fallback
	) : (
		<React.Suspense fallback={fallback}>{props.children}</React.Suspense>
	)
}
