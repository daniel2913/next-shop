'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
	expires:Date
}

export default function Timer({expires}:Props){
	const [timeLeft, setTimeLeft] = React.useState(0)
	React.useEffect(()=>{
		const timer = setTimeout(()=>
			setTimeLeft(Math.max(+expires-Date.now(),0)),
		1000
		)
		return ()=>clearTimeout(timer)
	})
	const gtime = new Date(timeLeft)
	const time = new Date(+gtime+gtime.getTimezoneOffset()*1000*60)
	return(
			<span 
				className='text-[.75em] text-gray-500 text-center'
			>
				{`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}
		</span>
	)
	
}
