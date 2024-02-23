"use client"
import React from "react"

type Props = {
	children: React.ReactNode
}
function getScrollBarWidth() {
  const el = document.createElement("div");
  el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
  document.body.appendChild(el);
  const width = el.offsetWidth - el.clientWidth;
  el.remove();
  return width;
}
export default function NavBarContainer({ children }: Props) {
		const offset = React.useRef(16)
		const hasScrollbar = React.useSyncExternalStore(
			onChange => {
				const test = new ResizeObserver(onChange)
				test.observe(document.body)
				return ()=>test.disconnect
			},
			()=>document.body.scrollHeight>document.body.clientHeight,
			()=>true
	)
		
		React.useEffect(()=>{
			offset.current = getScrollBarWidth()
		},[])
		return (
		<>
		<header 
			style={{
			paddingRight:hasScrollbar ? "" : `${offset.current}px`
			}}
			className="pointer-events-auto fixed left-0 right-0 bottom-0 md:top-0 z-[100] md:mb-2 flex h-12 pr-[var(--removed-body-scroll-bar-size)] items-center bg-secondary md:py-1 text-foreground"
		>
			{children}
		</header>
		<div className="relative h-12 mt-6 md:mt-0 md:mb-6">.</div>
		</>
	)
}
