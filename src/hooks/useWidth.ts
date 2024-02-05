import React from "react"
export default function useResponsive():"desktop"|"mobile"{
	if (typeof window === "undefined") return "desktop"
	const mode:"desktop"|"mobile" = React.useSyncExternalStore(
		(onChange)=>{window.addEventListener("resize",onChange);return ()=>window.removeEventListener("resize",onChange)},
		()=>window.innerWidth>640 ? "desktop" : "mobile",
		()=>"desktop"
	)
	return mode
}
