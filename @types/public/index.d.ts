/* eslint-disable no-unused-vars */
declare module "*.scss" {
	const styles: { [className: string]: string }
	export default styles
}

declare module "*.svg" {
	import { SVGProps, ReactElement } from "react"
	const svg: (props: SVGProps<SVGElement>) => ReactElement
	export default svg
}
