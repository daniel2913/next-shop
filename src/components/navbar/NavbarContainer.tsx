"use client";
import React from "react";

type Props = {
	children: React.ReactNode;
};
function getScrollBarWidth() {
	const el = document.createElement("div");
	el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
	document.body.appendChild(el);
	const width = el.offsetWidth - el.clientWidth;
	el.remove();
	return width;
}
export default function NavBarContainer({ children }: Props) {
	const offset = React.useRef(16);
	const hasScrollbar = React.useSyncExternalStore(
		(onChange) => {
			const test = new ResizeObserver(onChange);
			test.observe(document.body);
			return () => test.disconnect;
		},
		() => document.body.scrollHeight > document.body.clientHeight,
		() => true,
	);

	React.useEffect(() => {
		offset.current = getScrollBarWidth();
	}, []);
	return (
		<>
			<nav
				style={{
					paddingRight: hasScrollbar ? "" : `${offset.current}px`,
				}}
				className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[100] flex h-12 items-center bg-secondary pr-[var(--removed-body-scroll-bar-size)] text-foreground md:top-0 md:mb-2 md:py-1"
			>
				{children}
			</nav>
			<div className="relative mt-6 h-12 md:mb-6 md:mt-0">.</div>
		</>
	);
}
