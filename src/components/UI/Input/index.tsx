"use client"

import React, { ComponentProps } from "react"
import {Input as BaseInput} from "@/components/material-tailwind"

type Props = {
	validate?:(val:string)=>false|string
	value?:string
	setValue?:(val:string)=>void
	error?:string
	type?: "text"|"password"|"number"
} & ComponentProps<typeof BaseInput>

export default function Input(props:Props){
	let [value,setValue] = React.useState(props.value||"")
	const [error, setError] = React.useState(props.error||" ")
	React.useEffect(()=>{
		if (props.setValue){
			props.setValue(value)
		}
	},[value,props.setValue])
	
	return(
		<>
			<BaseInput
				label={props.label}
				onBlur={() => setError(props.validate?.(value)||"")}
				error={!!error&&error!==" "}
				success={!error}
				id={props.id}
				name={props.name}
				type={props.type||"text"}
				value={value}
				onChange={(e)=>setValue(e.currentTarget.value)}
			/>
			{
				!props.validate
				? null
				:
			<label
				htmlFor={props.id || ""}
				className="text-accent1-600 min-h-4"
			>
				{error}
			</label>
			}
		</>
	)
}
