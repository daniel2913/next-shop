"use client"
type Props = {
	value:string
	setValue:(val:string)=>void
}

export default function DatePicker({value,setValue}:Props){
	return(
		<>
			<input type="datetime-local" value={value} onChange={(e)=>setValue(e.currentTarget.value)}/>
		</>
	)
}
