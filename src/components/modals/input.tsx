import React from "react"

type Props = {
	close:()=>void
	resolve:(value:string)=>void
}

export default function InputModal({close,resolve}:Props){
	const [value,setValue] = React.useState('')
	return(
		<div>
			<input value={value} onChange={(e)=>setValue(e.currentTarget.value)} type="text"/>
			<button type="button" onClick={()=>resolve(value)}>Ok</button>
			<button type="button" onClick={()=>close()}>Cancel</button>
		</div>
	)
		
}
