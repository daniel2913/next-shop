import {Slider as BaseSlider} from "@/components/material-tailwind"
import React from "react"

type Props = React.ComponentProps<typeof BaseSlider>

export default function Slider(props:Props){
	return(
		<>	
			<input name={props.id} id={props.id} value={props.value||props.defaultValue} hidden readOnly/>
			<BaseSlider {...props}/>
		</>
)
}
