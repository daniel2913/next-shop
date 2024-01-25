import {Slider as SliderBase} from "@/components/material-tailwind"
type Props = {
	label:string
	value:number
	onChange:(val:number)=>void
}
export default function Slider(){
	return(
		<SliderBase
		/>
	)
}
