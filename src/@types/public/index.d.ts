/* eslint-disable no-unused-vars */
declare module "*.svg" {
	import type { SVGProps, ReactElement } from "react";
	const svg: (props: SVGProps<SVGElement>) => ReactElement;
	export default svg;
}
