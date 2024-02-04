import React from "react";

export default function Loading({children}:{children:React.ReactNode}){
	return(
		<React.Suspense fallback={
			<div className="h-40 w-40 bg-red-400 relative">
				<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin">
					Loading
				</span>
			</div>
			}>
		{children}
		</React.Suspense>
	)
}
